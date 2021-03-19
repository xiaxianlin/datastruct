import * as fs from 'fs'
class Bitmap {
    private _M: Array<number>
    private _N: number

    constructor(file?: string | number, n?: number) {
        if (!file) {
            this.init(8)
        }
        if (typeof file === 'number' && !n) {
            this.init(file)
        }

        if (typeof file === 'string' && typeof n === 'number') {
            this.init(n)
            let buffer = fs.readFileSync(file)
            for (let i = 0; i < this._N; i++) this._M[i] = buffer[i]
        }
    }

    init(n: number) {
        this._N = Math.floor((n + 7) / 8)
        this._M = new Array<number>(this._N)
    }

    set(k: number) {
        this._M[k >> 3] |= 0x80 >> (k & 0x07)
    }

    clear(k: number) {
        this._M[k >> 3] &= ~(0x80 >> (k & 0x07))
    }

    test(k: number) {
        return this._M[k >> 3] & (0x80 >> (k & 0x07))
    }

    bits2string(n: number) {
        let s = ''
        for (let i = 0; i < n; i++) s += this.test(i) ? '1' : '0'
        return s
    }
}

export default Bitmap
