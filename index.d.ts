export declare class Schema {
    private static isRef(obj);
    cache: {
        [url: string]: any;
    };
    bundled: {
        [index: string]: any;
    };
    private url;
    private progress?;
    private totalFiles;
    private loadedFiles;
    private yamlParse;
    private httpGet;
    private refs;
    private DEFINITIONS;
    constructor(url: string, progress?: () => void, yamlParse?: (yaml: string) => any, httpGet?: (url: string) => Promise<any>);
    load(): Promise<any>;
    bundle(): void;
    deref(direct?: boolean, clean?: boolean): void;
    private bundledPath(relativePart, hash);
    private getRefs(obj, refs?, index?, owner?, key?);
    private getUrls(refs, url);
    private parseFile(json, url);
    private report(cached?);
    private loadFile(url);
    /**
     * @param root
     * @param {string} path #/definitions/in/root/object
     */
    private getObjectByPath(root, path, create?);
    private getObjectByUrl(parsedUrl);
    private bundlePart(item, url);
    private followRef(url);
    private simplifyRefs(refs);
}
