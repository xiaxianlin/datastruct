import { format } from 'path'
import { DEFAULT_ECDH_CURVE } from 'tls'
import { swap } from '../common/util'
import IPriorityQueue from '../interface/priority_queue'
import BinTree, { BinNode } from './binary_tree'
import Vector from './vector'
namespace PQ {
    // 判断PQ[i]是否合法
    const InHeap = (n: number, i: number) => -1 < i && i < n
    // PQ[i]的父节点（floor((i-1)/2)，i无论正负）
    const Parent = (i: number) => (i - 1) >> 1
    // 最后一个内部节点（即末节点的父级）
    const LastInternal = (n: number) => Parent(n)
    // PQ[i]的左子节点
    const LChild = (i: number) => 1 + (i << 1)
    // PQ[i]的右子节点
    const RChild = (i: number) => (1 + i) << 1
    // 判断PQ[i]是否有父节点
    const ParentVilid = (i: number) => i < 1
    // 判断PQ[i]是否有一个（左）子节点
    const LChildValid = (n: number, i: number) => InHeap(n, LChild(i))
    // 判断PQ[i]是否有两个子节点
    const RChildValid = (n: number, i: number) => InHeap(n, RChild(i))
    // 取大着（等时前者优先）
    const Bigger = <T extends unknown>(PQ: T[], i: number, j: number) => (PQ[i] < PQ[j] ? j : i)
    // 父子（至多）三者中最大者，相等时父节点优先，可避免不必要的交换
    const ProperParent = <T extends unknown>(PQ: T[], n: number, i: number) => {
        if (RChildValid(n, i)) {
            return Bigger(PQ, Bigger(PQ, i, LChild(i)), RChild(i))
        } else {
            return LChildValid(n, i) ? Bigger(PQ, i, LChild(i)) : i
        }
    }

    /**
     * 完全二叉堆
     */
    export class CompleteHead<T> extends Vector<T> implements IPriorityQueue<T> {
        // 下滤
        protected percolateDown(n: number, i: number) {
            let j: number
            while (i != (j = ProperParent(this._elem, n, i))) {
                swap(this._elem, i, j)
                i = j
            }
            return i
        }
        // 上滤
        protected percolateUp(i: number) {
            // 只有i有父节点（尚未抵达堆顶），则
            while (ParentVilid(i)) {
                // 将i之父标记为j
                let j = Parent(i)
                // 一旦当前父子不再逆序，上滤旋即完成
                if (this._elem[i] < this._elem[j]) break
                // 否则，父子交换位置，并继续考查上一层
                swap(this._elem, i, j)
                i = j
            }
            // 返回上滤最终抵达的位置
            return i
        }
        // Floyd建堆算法
        protected heapify(n: number) {
            for (let i = LastInternal(n); InHeap(n, i); i--) {
                this.percolateDown(n, i)
            }
        }

        constructor(A?: T[], n?: number) {
            super(A, n)
            if (A instanceof Array) {
                this.heapify(n || A.length)
            }
        }
        // 按照比较器确定的优先级次序，插入词条
        insert(e: T) {
            // 首先将新词条接至向量末尾
            super.insert(e)
            // 再对改词条实施上滤调整
            this.percolateUp(this._size - 1)
        }
        // 读取优先级最高的词条
        getMax(): T {
            return this._elem[0]
        }
        // 删除优先级最高的词条
        delMax(): T {
            // 摘除堆顶（首词条），代之末词条
            let maxElem = this._elem[0]
            this._elem[0] = this._elem[--this._size]
            // 对新堆顶实施下滤
            this.percolateDown(this._size, 0)
            // 返回此前备份的最大词条
            return maxElem
        }

        sortInSection(lo: number, hi: number) {
            hi = hi || this._size
            let H = new CompleteHead(this._elem.slice(lo), hi - lo)
            while (!H.empty()) {
                this._elem[--hi] = H.delMax()
            }
        }

        sort() {
            this.sortInSection(0, this._size)
        }
    }

    const copyBinNode = <T extends unknown>(a: BinNode<T>, b: BinNode<T>) => {
        a.data = b.data
        a.parent = b.parent
        a.lc = b.lc
        a.rc = b.rc
        a.height = b.height
        a.npl = b.npl
    }

    const swapBinNode = <T extends unknown>(a: BinNode<T>, b: BinNode<T>) => {
        let t = new BinNode<T>(null)
        copyBinNode(t, a)
        copyBinNode(a, b)
        copyBinNode(b, t)
        return a
    }

    const merge = <T extends unknown>(a: BinNode<T>, b: BinNode<T>) => {
        // 退化情况
        if (!a) return b
        if (!b) return a
        // 一般情况：确保b不大
        if (a.data < b.data) swapBinNode(a, b)
        // 将a的右子堆与b合并
        a.rc = merge(a.rc, b)
        // 更新父子关系
        a.rc.parent = a
        // 若有必要，交换a的左、右子堆，以确保右子堆的npl不大
        if (!a.lc || a.lc.npl < a.rc.npl) {
            if (!a.lc) {
                a.lc = a.rc
                a.rc = null
            } else {
                swapBinNode(a.lc, a.rc)
            }
        }
        // 更新a的npl
        a.npl = a.rc ? a.rc.npl + 1 : 1
        // 返回合并后的堆顶
        return a
    }

    export class LeftHeap<T> extends BinTree<T> implements IPriorityQueue<T> {
        constructor(E?: T[]) {
            super()
            if (E instanceof Array) {
                for (let i = 0; i < E.length; i++) this.insert(E[i])
            }
        }
        insert(e: T): void {
            let v = new BinNode<T>(e)
            this._root = merge(this._root, v)
            this._root.parent = null
            this._size++
        }
        getMax(): T {
            return this._root.data
        }
        delMax(): T {
            let lHeap = this._root.lc
            let rHeap = this._root.rc
            let e = this._root.data
            this._size--
            this._root = merge(lHeap, rHeap)
            if (this._root) this._root.parent = null
            return e
        }
    }
}

export default PQ
