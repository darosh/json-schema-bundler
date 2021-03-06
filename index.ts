declare const jsyaml: any;
declare const axios: any;

function deep(obj: any) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  const temp = obj.constructor();

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      temp[key] = deep(obj[key]);
    }
  }

  return temp;
}

function relativeUrl(u1: string, u2: string) {
  const s1 = u1.split('/');
  const s2 = u2.split('/');

  while ((s2[0] !== undefined) && (s1.shift() === s2[0])) {
    s2.shift();
  }

  return s2.join('/');
}

function extensionUrl(url: string) {
  const s = url.split('.');
  return s[s.length - 1];
}

interface IRef {
  val: any;
  owner: any;
  key: string;
}

export class Schema {
  private static isRef(obj: any) {
    return (Object.keys(obj).length - (obj.$ref ? 1 : 0)) === 0;
  }

  public cache: { [url: string]: any } = {};
  public bundled: { [index: string]: any };

  private url: string;
  private progress?: (stats: any) => void;
  private totalFiles: number = 0;
  private loadedFiles: number = 0;
  private yamlParse: (yaml: string) => any;
  private httpGet: (url: string) => Promise<any>;
  private refs: IRef[];
  private DEFINITIONS: string = 'definitions';

  constructor(url: string,
              progress?: () => void,
              yamlParse?: (yaml: string) => any,
              httpGet?: (url: string) => Promise<any>) {
    this.url = url;
    this.progress = progress;
    this.yamlParse = yamlParse || jsyaml.load;
    this.httpGet = httpGet || axios.get;
  }

  public load(): Promise<any> {
    return this.loadFile(this.url);
  }

  public bundle(): void {
    this.bundled = deep(this.cache[this.url]);
    this.refs = this.bundlePart(this.bundled, this.url);
    this.refs = Object.keys(this.cache).length === 1 ? this.refs : this.getRefs(this.bundled);
    this.simplifyRefs(this.refs);
  }

  public deref(direct: boolean = true, clean: boolean = true): void {
    const refs = this.refs;
    const cache: { [url: string]: any } = {};

    if (direct) {
      refs.forEach((ref) => {
        cache[ref.val.$ref] = cache[ref.val.$ref] || this.getObjectByPath(this.bundled, ref.val.$ref, false);
      });

      refs.forEach((ref) => {
        if (typeof cache[ref.val.$ref].val !== 'undefined') {
          ref.owner[ref.key] = cache[ref.val.$ref].val;
        }
      });

      if (!clean) {
        return;
      }

      const parents: { [url: string]: boolean } = {};
      const leftovers: IRef[] = refs.filter((ref) => ref.val === ref.owner[ref.key]);

      leftovers.forEach((ref: any) => {
        leftovers[ref.val.$ref] = leftovers[ref.val.$ref]
          || this.getObjectByPath(this.bundled, ref.val.$ref, false);
      });

      Object.keys(cache).forEach((k) => {
        const s = k.split('/');
        s.pop();
        const p = s.join('/');
        parents[p] = true;

        if (!cache[p] && !leftovers[k as any]) {
          const o = cache[k];
          delete  o.owner[o.key];
        }
      });

      Object.keys(parents).forEach((k) => {
        const o = this.getObjectByPath(this.bundled, k, false);

        if (o.val && (Object.keys(o.val).length === 0)) {
          delete o.owner[o.key];
        }
      });

      const original = this.cache[this.url];

      for (const key in this.bundled) {
        if (!original.hasOwnProperty(key)) {
          delete this.bundled[key];
        }
      }
    } else {
      refs.forEach((ref) => {
        ref.val.$deref = ref.val.$deref || this.getObjectByPath(this.bundled, ref.val.$ref).val;
      });
    }
  }

  private bundledPath(relativePart: string, hash: string) {
    const path = '#' + (relativePart ? '/' + relativePart : '') + (hash ? hash : '');
    const s = path.split('/');

    if ((s[1] !== this.DEFINITIONS) && !this.bundled[s[1]]) {
      s.splice(1, 0, this.DEFINITIONS);
    }

    return s.join('/');
  }

  private getRefs(obj: any,
                  refs: IRef[] = [],
                  index: any[] = [],
                  owner?: any,
                  key?: string): IRef[] {
    if (obj && obj.$ref && (typeof obj.$ref === 'string')) {
      refs.push({val: obj, owner, key});
    }

    for (let i = 0, keys = Object.keys(obj); i < keys.length; i++) {
      const k = keys[i];

      if (obj[k] && (typeof obj[k] === 'object') && (index.indexOf(obj[k]) === -1)) {
        index.push(obj[k]);
        this.getRefs(obj[k], refs, index, obj, k);
      }
    }

    return refs;
  }

  private getUrls(refs: IRef[], url: string): string[] {
    const urls: { [url: string]: boolean } = {};

    refs.forEach((ref) => {
      const parsedUrl = new URL(ref.val.$ref, url);
      const u = parsedUrl.origin + parsedUrl.pathname;

      if (!this.cache[u] && !urls[u] && parsedUrl.pathname) {
        urls[u] = true;
      }
    });

    return Object.keys(urls);
  }

  private parseFile(json: any, url: string) {
    const refs = this.getRefs(json);
    const urls = this.getUrls(refs, url);
    const promises: any[] = [];

    urls.forEach((u) => {
      promises.push(this.loadFile(u));
    });

    return Promise.all(promises);
  }

  private report(cached: boolean = false) {
    if (this.progress) {
      this.progress({total: this.totalFiles, loaded: this.loadedFiles, cached});
    }
  }

  private loadFile(url: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.cache[url]) {
        this.totalFiles++;
        this.loadedFiles++;
        this.report(true);
        this.parseFile(this.cache[url], url).then(resolve);
      } else {
        this.cache[url] = true;
        this.totalFiles++;
        this.report();

        this.httpGet(url)
          .then((res) => {
            this.loadedFiles++;
            this.report();

            if (typeof res.data === 'string'
              && (res.headers
                && res.headers['content-type']
                && res.headers['content-type'].indexOf('yaml') > -1
                || extensionUrl(url).toLowerCase() === 'yaml')) {

              try {
                res.data = this.yamlParse(res.data);
              } catch (ign) {
                // Invalid YAML as text...?
              }
            }

            this.cache[url] = res.data;
            this.parseFile(this.cache[url], url).then(resolve);
          })
          .catch((err) => {
            reject(err);
          });
      }
    });
  }

  /**
   * @param root
   * @param {string} path #/definitions/in/root/object
   */
  private getObjectByPath(root: any, path: string, create: boolean = true): any {
    const parts = (path || '').split('/');
    parts.shift();
    let o = root;
    let key = null;
    let owner = null;

    for (const part of parts) {
      if (o) {
        key = decodeURIComponent(part);
        o[key] = typeof o[key] !== 'undefined' ? o[key] : (create ? {} : undefined);
        owner = o;
        o = o[key];
      } else {
        break;
      }
    }

    return {val: o, owner, key};
  }

  private getObjectByUrl(parsedUrl: URL): any {
    const url = parsedUrl.origin + parsedUrl.pathname;
    return this.getObjectByPath(this.cache[url], parsedUrl.hash);
  }

  private bundlePart(item: any, url: string): IRef[] {
    const refs = this.getRefs(item);
    const rootUrl = new URL(url, this.url);
    const bundle: any[] = [];

    refs.forEach((ref) => {
      const refUrl = new URL(ref.val.$ref, rootUrl.href);
      const partUrl = refUrl.origin + refUrl.pathname;
      const relativePart = relativeUrl(this.url, partUrl);
      const path = this.bundledPath(relativePart, refUrl.hash);
      const t = this.getObjectByUrl(refUrl);

      if (t.val && (typeof t.val === 'object')) {
        const o = this.getObjectByPath(this.bundled, path);

        if (Schema.isRef(o.val) && (!o.val.$ref || (o.val.$ref !== t.val.$ref))) {
          if (t.val.$ref) {
            o.val.$ref = t.val.$ref;
          } else {
            Object.assign(o.val, deep(t.val));
          }

          ref.val.$ref = path;
          bundle.push([o.val, partUrl]);
        }
      } else if (!t.val || (typeof t.val !== 'object')) {
        const o = this.getObjectByPath(this.bundled, path);
        o.owner[o.key] = t.val;
      }

      ref.val.$ref = path;
    });

    bundle.forEach((d) => this.bundlePart(d[0], d[1]));

    return refs;
  }

  private followRef(url: string): string {
    let parts = url.split('/');
    parts.shift();
    let o: any = this.bundled;
    const included = [];

    for (let i = 0; i < parts.length; i++) {
      o = o[decodeURIComponent(parts[i])];

      const next = (o && ((i + 1) < parts.length)) ? o[decodeURIComponent(parts[i + 1])] : null;

      if (!next && o && o.$ref && (o.$ref !== url)) {
        if (included.indexOf(o) > -1) {
          break;
        }

        included.push(o);

        const rest = parts.slice(i + 1);
        rest.unshift(o.$ref);
        parts = rest.join('/').split('/');
        parts.shift();
        i = 0;
        o = this.bundled;
        o = o[decodeURIComponent(parts[i])];
      } else if (!o) {
        break;
      }
    }

    parts.unshift('#');
    return parts.join('/');
  }

  private simplifyRefs(refs: IRef[]): void {
    refs.forEach((ref) => {
      ref.val.$ref = this.followRef(ref.val.$ref);
    });
  }
}
