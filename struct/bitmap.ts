import * as fs from 'fs'
// 0x80 -> 128
// 0x70 -> 112
// x >> y -> Math.floor(x / (y * y))
class Bitmap {
    private _M: Array<number>
    private _N: number

    constructor(file?: string | number, n?: number) {
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

class Bitmap1 {
    private _F: number[] // 规模为N的向量F，记录[k]被标记的次序（即其在栈T[]中的秩）
    private _N: number
    private _T: number[] // 规模为N的栈T，记录被标记各位秩的栈
    private _top: number // 栈顶

    constructor(n: number) {
        this._N = n
        this._F = new Array(n)
        this._T = new Array(n)
        this._top = 0
    }

    reset() {
        this._top = 0
    }

    set(k: number) {
        if (!this.test(k)) {
            this._T[this._top] = k
            this._F[k] = this._top++
        }
    }

    clear(k: number) {
        if (this.test(k) && --this._top) {
            this._F[this._T[this._top]] = this._F[k]
            this._T[this._F[this._top]] = this._T[this._top]
        }
    }

    test(k: number) {
        return -1 < this._F[k] && this._F[k] < this._top && k == this._T[this._F[k]]
    }
}

export default Bitmap
