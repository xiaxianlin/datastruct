import { Rank } from '../common/types'
import { isdigit, swap } from '../common/util'
import { binSearchB, binSearchC } from '../algorithm/search'
import { mergeSort } from '../algorithm/sort'

const { random, floor } = Math
const DEFAULT_CAPACTIY = 10

class Vector<T> {
    protected _size = 0
    protected _capactiy = DEFAULT_CAPACTIY
    protected _elem: T[] = []

    protected assertOutOfBounds(r: Rank, method: string = 'any') {
        if (r < 0 || r > this._size) {
            throw `[${method}]: Vector rank [${r}] out of bounds.`
        }
    }

    protected assertSectionRank(lo: Rank, hi: Rank, method: string = 'any') {
        this.assertOutOfBounds(lo, method)
        this.assertOutOfBounds(hi, method)
        if (lo >= hi) {
            throw 'Low rank greater than high Rank'
        }
    }

    // 复制向量
    protected copyFrom(A: Vector<T> | Array<T>, lo: Rank, hi: Rank) {
        this._elem = new Array((this._capactiy = 2 * (hi - lo)))
        this._size = 0
        while (lo < hi) {
            this._elem[this._size++] = A instanceof Vector ? A.get(lo++) : A[lo++]
        }
    }

    // 扩容
    protected expand() {
        // 尚未满员时，不必扩容
        if (this._size < this._capactiy) return
        // 不低于最小容量
        if (this._capactiy < DEFAULT_CAPACTIY) this._capactiy = DEFAULT_CAPACTIY
        let oldElem = this._elem
        // 容量加倍
        this._elem = new Array((this._capactiy <<= 1))
        // 复制内容
        for (let i = 0; i < this._size; i++) this._elem[i] = oldElem[i]
    }

    // 压缩
    protected shrink() {
        // 不要收缩到DEFAULT_CAPACTIY以下
        if (this._capactiy < DEFAULT_CAPACTIY << 1) return
        // 以25%为界
        if (this._size << 2 > this._capactiy) return
        let oldElem = this._elem
        // 容量减半
        this._elem = new Array((this._capactiy >>= 1))
        // 复制内容
        for (let i = 0; i < this._size; i++) this._elem[i] = oldElem[i]
    }

    constructor(a1?: number | Vector<T> | T[], a2?: Rank, a3?: Rank | T) {
        this._elem = new Array(DEFAULT_CAPACTIY)
        // 初始化一个容量为a1，规模为a2，所有元素初始为a3
        if (typeof a1 === 'number' && typeof a2 === 'number' && typeof a3 !== 'undefined') {
            this._capactiy = Math.floor(a1)
            this._elem = new Array<T>(this._capactiy)
            for (this._size = 0; this._size < a2; this._size++) {
                this._elem[this._size] = a3 as T
            }
        }
        // 数组整体复制
        if (a1 instanceof Array && !a2 && !a3) {
            this.copyFrom(a1, 0, a1.length)
        }
        // 数组区间复制
        if (a1 instanceof Array && typeof a2 === 'number' && !a3) {
            this.copyFrom(a1, 0, Math.floor(a2))
        }
        // 数组区间复制
        if (a1 instanceof Array && typeof a2 === 'number' && typeof a3 === 'number') {
            this.copyFrom(a1, Math.floor(a2), Math.floor(a3))
        }
        // 向量整体复制
        if (a1 instanceof Vector && !a1 && !a2) {
            this.copyFrom(a1, 0, a1.size())
        }
        // 向量区间复制
        if (a1 instanceof Vector && typeof a2 === 'number' && typeof a3 === 'number') {
            this.copyFrom(a1, Math.floor(a2), Math.floor(a3))
        }
    }

    // 打印使用
    print() {
        console.log(this._elem)
    }

    // 获取元素
    get(r: Rank) {
        this.assertOutOfBounds(r, 'get')
        return this._elem[r]
    }

    // 在指定位置之后替换元素
    put(r: Rank, e: T) {
        this.assertOutOfBounds(r, 'put')
        this._elem[r] = e
    }

    // 在指定位置之后插入元素
    insertAt(r: Rank, e: T) {
        this.expand()
        this._size++
        for (let i = this._size; i > r; i--) {
            this._elem[i] = this._elem[i - 1]
        }
        this._elem[r] = e
    }

    insert(e: T) {
        this.expand()
        this._elem[this._size] = e
        this._size++
    }
    // 删除指定位置的元素
    remove(r: Rank) {
        let e = this._elem[r]
        this.sectionRemove(r, r + 1)
        return e
    }

    // 区间删除
    sectionRemove(lo: Rank, hi: Rank) {
        this.assertSectionRank(lo, hi, 'sectionRemove')
        if (lo == hi) return 0
        // [hi, _size)顺次前移hi-lo个单元
        while (hi < this._size) this._elem[lo++] = this._elem[hi++]
        let index = lo
        while (index < this._size) delete this._elem[index++]
        // 更新规模，直接丢弃尾部[lo， _size = hi)区间
        this._size = lo
        this.shrink()
        return hi - lo
    }

    // 大小
    size() {
        return this._size
    }

    // 是否空
    empty() {
        return this._size === 0
    }

    // 向量中逆序相邻元素对的总数
    disordered() {
        let n = 0
        for (let i = 0; i < this._size; i++) if (this._elem[i - 1] > this._elem[i]) n++
        return n
    }

    // 无序向量的顺序查找，返回最后一个元素e的位置
    find(e: T): Rank {
        return this.findInSection(e, 0, this._size)
    }

    // 区间无序向量的顺序查找，返回最后一个元素e的位置
    findInSection(e: T, lo: Rank, hi: Rank) {
        this.assertSectionRank(lo, hi, 'findInSection')
        while (lo < hi-- && e != this.get(hi));
        return hi < lo ? -1 : hi
    }

    search(e: T): Rank {
        return this.searchInSection(e, 0, this._size)
    }

    searchInSection(e: T, lo: Rank, hi: Rank) {
        return binSearchC(this._elem, e, lo, hi)
    }

    sort() {
        this.sortInSection(0, this._size)
    }

    sortInSection(lo: Rank, hi: Rank) {
        mergeSort(this._elem, lo, hi)
    }

    // 置乱
    unsort() {
        this.unsortInSection(0, this._size)
    }

    // 区间置乱
    unsortInSection(lo: Rank, hi: Rank) {
        this.assertSectionRank(lo, hi)
        let v = this._elem.slice(lo, hi)
        for (let i = hi - lo; i > 0; i--) {
            swap(v as [], i - 1, floor((random() * i) % i))
        }
        this._elem.splice(lo, hi - lo, ...v)
    }

    // 无序向量去重
    deduplicate() {
        let oldSize = this._size,
            i = 1
        while (i < this._size) {
            this.findInSection(this._elem[i], 0, i) < 0 ? i++ : this.remove(i)
        }
        return oldSize - this._size
    }

    // 有序向量去重（低效版）
    uniquify() {
        let oldSize = this._size,
            i = 1
        while (i < this._size) {
            this._elem[i - 1] === this._elem[i] ? this.remove(i) : i++
        }
        return oldSize - this._size
    }

    // 前后倒置
    reverse() {
        let mid = (this._size >> 1) + 1
        for (let i = 0; i < mid; i++) {
            swap(this._elem, i, this._size - i - 1)
        }
    }

    // 遍历
    traverse(visit: (e: T) => void) {
        for (let i = 0; i < this._size; i++) visit(this._elem[i])
    }

    getElements() {
        return this._elem
    }
}

export default Vector
