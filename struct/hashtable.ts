import * as path from 'path'
import { hashCode, primeNLT } from '../common/util'
import Dictionary from '../interface/dictionary'
import Bitmap from './bitmap'
import Entry from './entry'

const file = path.resolve('./assets/prime-1048576-bitmap.txt')

class HashTable<K, V> implements Dictionary<K, V> {
    private _ht: Entry<K, V>[] // 桶组数，存放词条
    private _M: number // 通数组量
    private _N: number // 词条数量
    private _L: number // 懒惰删除标记的数目（N + L <= M）
    private _removed: Bitmap // 懒惰删除标记
    // 沿关键码k对应的查找链，找到词条匹配的桶
    protected probe4Hit(k: K) {
        // 按除余法确定试探链起点
        let r = hashCode(k) % this._M
        // 线性试探（跳过带懒惰删除标记的桶）
        while ((this._ht[r] && k !== this._ht[r].key) || (!this._ht[r] && this._removed.test(r))) {
            r = (r + 1) % this._M
        }
        // 调用者根据ht[r]是否为空及其内容，即可判断查找是否成功
        return r
    }
    // 沿关键码k对应的查找链，找到首个可用桶
    protected probe4Free(k: K) {
        // 从起始桶（按除余法确定）出发
        let r = hashCode(k) % this._M
        // 沿查找链逐桶试探，直到首个空桶（无论是否带有懒惰删除标记）
        while (this._ht[r]) r = (r + 1) % this._M
        return r // 为保证空桶总能找到，装填因子及散列表长需要设置合理
    }
    // 重散列算法：扩充桶数组，保证装填因子在警戒线以下
    protected rehash() {
        let oldCapacity = this._M,
            oldHt = this._ht
        // 容量加倍
        this._M = primeNLT(2 * this._M, 1048576, file)
        // 新桶数量
        this._N = 0
        this._ht = new Array<Entry<K, V>>(this._M)
        // 新开懒惰删除标记比特图
        this._removed = new Bitmap(this._M)
        // 扫描原桶数组
        for (let i = 0; i < oldCapacity; i++) {
            // 将非空桶中的词条逐一
            if (oldHt[i]) {
                // 插入至新的桶数组
                this.put(oldHt[i].key, oldHt[i].value)
            }
        }
    }

    constructor(c: number = 5) {
        this._M = primeNLT(c, 1048576, file) // 不小于c的素数M
        // 开辟桶数组
        this._N = 0
        this._ht = new Array<Entry<K, V>>(this._M)
        // 用Bitmap记录懒惰删除
        this._removed = new Bitmap(this._M)
        this._L = 0
    }

    size(): number {
        throw new Error('Method not implemented.')
    }
    put(k: K, v: V): boolean {
        // 雷同元素不必重复插入
        if (this._ht[this.probe4Hit(k)]) return false
        // 为新词条找个空桶（只要装填因子控制得当，必然成功）
        let r = this.probe4Free(k)
        // 插入（注意：懒惰删除标记无需复位）
        this._ht[r] = new Entry<K, V>(k, v)
        ++this._N
        // 装填因子高于50%后重散列
        if (this._N * 2 > this._M) this.rehash()
        return true
    }
    get(k: K): V {
        let r = this.probe4Hit(k)
        // 禁止词条的key值雷同
        return this._ht[r] ? this._ht[r].value : null
    }
    remove(k: K): boolean {
        // 确认目标词条确实存在
        let r = this.probe4Hit(k)
        if (!this._ht[r]) return false
        // 清除目标词条
        this._ht[r] = null
        // 更新标记、计数器
        this._removed.set(r)
        --this._N
        ++this._L
        // 若懒惰删除标记过多，重散列
        if (3 * this._N < this._L) this.rehash()
        return true
    }
}

export default HashTable
