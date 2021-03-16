import BinTree, { BinNode } from './binary_tree'

class BST<T> extends BinTree<T> {
    protected _hot: BinNode<T> = null

    protected bstRemoveAt(x: BinNode<T>) {
        let w = x // 实际被摘除的节点，初值x
        let succ: BinNode<T> = null // 实际被删除节点的接替者
        // 若x的左子树为空，则可直接将x替换为其右子树
        if (!x.hasLChild()) {
            succ = x.rc
        }
        // 若x的右子树为空，则可对称地处理--注意：此时succ != null
        else if (!x.hasRChild()) {
            succ = x.lc
        }
        // 若左右子树均存在，则选择x的直接后继作为实际被摘除的节点，为此需要
        else {
            w = w.succ() // （在右子树）找到x的直接后继w
            // 交换x和w的数据元素
            let t = x.data
            x.data = w.data
            w.data = t
            // 隔离节点w
            let u = w.parent
            if (u === x) {
                u.rc = succ = w.rc
            } else {
                u.lc = succ = w.rc
            }
        }
        this._hot = w.parent // 记录实际被删除节点的父级
        if (succ) {
            // 并将被删除节点的接替者与hot相联
            succ.parent = this._hot
            if (succ.isLChild()) {
                this._hot.lc = succ
            } else {
                this._hot.rc = succ
            }
        }
        return succ // 返回接替者
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

    /**
     * 旋转后进行父级重联接
     */
    protected relinkAfterRotateAt(g: BinNode<T>, x: BinNode<T>) {
        let isRoot = g.isRoot(),
            parent = g.parent,
            isLC = g.isLChild()
        let subTree = this.rotateAt(x)
        // 重新接入原树
        if (isRoot) {
            this._root = subTree
        } else {
            if (isLC) {
                parent.lc = subTree
            } else {
                parent.rc = subTree
            }
        }
        return subTree
    }
    /**
     * 联接插入的新节点
     */
    protected linkInsertNode(x: BinNode<T>) {
        if (!this._root) {
            this._root = x
        } else {
            // 判断左右
            if (x.data < this._hot.data) {
                this._hot.lc = x
            } else {
                this._hot.rc = x
            }
        }
    }

    protected searchIn(v: BinNode<T>, e: T) {
        if (!v || e === this._root.data) return v
        this._hot = v
        return this.searchIn(e < this._hot.data ? v.lc : v.rc, e)
    }

    search(e: T) {
        // 在树根v处命中
        if (!this._root || e === this._root.data) {
            this._hot = null
            return this._root
        }
        // 否则，自顶而下
        for (this._hot = this._root; ; ) {
            // 确定方向
            let c = e < this._hot.data ? this._hot.lc : this._hot.rc
            // 命中返回，或者深入下一层
            if (!c || e === c.data) return c
            this._hot = c
        } // 无论命中或失败，hot均指向v之父节点（v是根时，hot为null）
    }
    insert(e: T) {
        // 确认目标不存在
        let x = this.search(e)
        if (x) return x
        x = new BinNode<T>(e, this._hot)
        // 如果没有根节点，先创建根节点
        this.linkInsertNode(x)
        this._size++
        this.updateHeightAbove(x)
        return x
    }
    remove(e: T) {
        // 确认目标存在（留意hot的位置）
        let x = this.search(e)
        if (!x) return false
        // 实施删除
        this.bstRemoveAt(x)
        this._size--
        // 更新hot及其历代祖先的高度
        this.updateHeightAbove(this._hot)
        return true
    }
}

export default BST
