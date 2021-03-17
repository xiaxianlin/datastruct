import { VST } from '../common/types'

export class QuadListNode<T> {
    entry: T // 所存词条
    pred: QuadListNode<T> = null // 前驱
    succ: QuadListNode<T> = null // 后继
    above: QuadListNode<T> = null // 上邻
    below: QuadListNode<T> = null // 下邻

    constructor(
        e?: T,
        p: QuadListNode<T> = null,
        s: QuadListNode<T> = null,
        a: QuadListNode<T> = null,
        b: QuadListNode<T> = null
    ) {
        if (e) {
            this.entry = e
            this.pred = p
            this.succ = s
            this.above = a
            this.below = b
        }
    }
    // 插入新节点，以当前节点为前驱，以节点b为下邻
    insertAsSuccAbove(e: T, b: QuadListNode<T> = null) {
        let x = new QuadListNode<T>(e, this, this.succ, null, b)
        this.succ.pred = x
        this.succ = x
        if (b) b.above = x
        return x
    }
}
class QuadList<T> {
    private _size: number // 规模
    private _header: QuadListNode<T> // 头哨兵
    private _trailer: QuadListNode<T> // 尾哨兵

    protected init() {
        this._header = new QuadListNode<T>()
        this._trailer = new QuadListNode<T>()
        this._header.succ = this._trailer
        this._header.pred = null
        this._trailer.pred = this._header
        this._trailer.succ = null
        this._header.above = this._trailer.above = null
        this._header.below = this._trailer.below = null
        this._size = 0
    }
    protected clear() {
        let oldSize = this._size
        while (0 < this._size) this.remove(this._header.succ)
        return oldSize
    }

    constructor() {
        this.init()
    }
    // 规模
    size() {
        return this._size
    }
    // 判空
    empty() {
        return this._size <= 0
    }
    // 首节点位置
    first() {
        return this._header.succ
    }
    // 末节点位置
    last() {
        return this._trailer.pred
    }
    // 判断位置p是否对外合法
    valid(p: QuadListNode<T>) {
        return p && this._trailer !== p && this._header !== p
    }
    // 删除（合法）位置p出的节点，返回被删除节点的value
    remove(p: QuadListNode<T>) {
        p.pred.succ = p.succ
        p.succ.pred = p.pred
        this._size--
        return p.entry
    }
    // 将e作为p的后继、b的上邻插入
    insertAfterAbove(e: T, p: QuadListNode<T>, b: QuadListNode<T> = null) {
        this._size++
        return p.insertAsSuccAbove(e, b)
    }
    // 遍历各节点，依次实施指定操作
    traverse(visit: VST<T>) {}
}

export default QuadList
