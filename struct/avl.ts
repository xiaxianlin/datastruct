import { compare, printBinTree } from '../common/util'
import { BinNode, stature } from './binary_tree'
import BST from './bst'

class AVL<T> extends BST<T> {
    // 在左、右子节点中取更高者，AVL平衡调整前，借此确定重构方案
    protected tallerChild(x: BinNode<T>) {
        // 左高
        if (stature(x.lc) > stature(x.rc)) {
            return x.lc
        } else {
            // 右高
            if (stature(x.lc) < stature(x.rc)) {
                return x.rc
            } else {
                // 等高：与父亲x同侧者（zig-zig或zag-zag）优先
                return x.isLChild() ? x.lc : x.rc
            }
        }
    }
    protected connect34(
        a: BinNode<T>,
        b: BinNode<T>,
        c: BinNode<T>,
        T0: BinNode<T>,
        T1: BinNode<T>,
        T2: BinNode<T>,
        T3: BinNode<T>
    ) {
        a.lc = T0
        if (T0) T0.parent = a
        a.rc = T1
        if (T1) T1.parent = a
        this.updateHeight(a)
        c.lc = T2
        if (T2) T2.parent = c
        c.rc = T3
        if (T3) T3.parent = c
        this.updateHeight(c)
        b.lc = a
        a.parent = b
        b.rc = c
        c.parent = b
        this.updateHeight(b)
        return b
    }
    protected rotateAt(v: BinNode<T>) {
        let p = v.parent
        let g = p.parent
        // zig
        if (p.isLChild()) {
            // zig-zig
            if (v.isLChild()) {
                p.parent = g.parent // 向上联接
                return this.connect34(v, p, g, v.lc, v.rc, p.rc, g.rc)
            }
            // zig-zag
            else {
                v.parent = g.parent // 向上联接
                return this.connect34(p, v, g, p.lc, v.lc, v.rc, g.rc)
            }
        }
        // zag
        else {
            // zag-zag
            if (v.isRChild()) {
                p.parent = g.parent // 向上联接
                return this.connect34(g, p, v, g.lc, p.lc, v.lc, v.rc)
            }
            // zag-zig
            else {
                v.parent = g.parent // 向上联接
                return this.connect34(g, v, p, g.lc, v.lc, v.rc, p.rc)
            }
        }
    }
    protected rotate(g: BinNode<T>) {
        // 缓存g的属性，用于后续重新接入
        if (!g.avlBalanced()) {
            let isRoot = g.isRoot(),
                parent = g.parent,
                isLC = g.isLChild()
            let subAvl = this.rotateAt(this.tallerChild(this.tallerChild(g)))
            // 重新接入原树
            if (isRoot) {
                this._root = subAvl
            } else {
                if (isLC) {
                    parent.lc = subAvl
                } else {
                    parent.rc = subAvl
                }
            }
        }
    }
    insert(e: T) {
        // 确认目标是否存在
        let x = this.search(e)
        if (x) return x
        // 创建新节点x
        let xx = (x = new BinNode<T>(e, this._hot))
        this._size++
        // 如果没有根节点，先创建根节点
        if (!this._root) {
            this._root = x
        } else {
            // 判断左右
            if (compare(e, this._hot.data, '<')) {
                this._hot.lc = x
            } else {
                this._hot.rc = x
            }
        }
        // 从x之父出发向上，逐层检查各代祖先g
        for (let g = this._hot; g; g = g.parent) {
            // 一旦发现g失衡，则（采用“3+4”算法）使之平衡，并将子树
            if (!g.avlBalanced()) {
                this.rotate(g)
                break // g复衡后，局部子树高度必须复原，其祖先亦必如此，故调整随即结束
            }
            // 否则（g依然平衡），只需简单地
            else {
                // 更新器高度（注意：即便g未失衡，高度亦可能增加）
                this.updateHeight(g)
            }
        } // 至多只需一次调整；若果真做过调整，则全树高度比如复原
        return xx // 返回新节点位置
    }
    remove(e: T) {
        let x = this.search(e)
        if (!x) return false
        this.bstRemoveAt(x)
        this._size--
        for (let g = this._hot; g; g = g.parent) {
            // 一旦发现g失衡，则（采用“3+4”算法）使之平衡，并将子树
            if (!g.avlBalanced()) {
                this.rotate(g)
            } else {
                // 更新其高度（注意：即便g未失衡，高度亦可能降低）
                this.updateHeight(g)
            }
        }
        return false
    }
}

export default AVL
