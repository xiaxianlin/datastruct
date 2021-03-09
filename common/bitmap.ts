class Bitmap {
    private _M: any[] = []

    constructor() {}

    set(k: number) {
        this._M[k >> 3] |= 0x80 >> (k & 0x70)
    }

    clear(k: number) {
        this._M[k >> 3] &= ~(0x80 >> (k & 0x70))
    }

    test(k: number) {
        return this._M[k >> 3] & (0x80 >> (k & 0x70))
    }

    bits2string(n: number) {
        let s: any[] = []
        for (let i = 0; i < n; i++) s[i] = this.test(i) ? '1' : '0'
        s.push('\0')
        return s
    }
}

export default Bitmap
