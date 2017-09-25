export default class Url {
    public static relative(u1: string, u2: string) {
        const s1 = u1.split('/');
        const s2 = u2.split('/');

        while ((s2[0] !== undefined) && (s1.shift() === s2[0])) {
            s2.shift();
        }

        return s2.join('/');
    }

    public static extension(url: string) {
        const s = url.split('.');
        return s[s.length - 1];
    }
}
