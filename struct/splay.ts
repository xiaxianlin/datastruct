import { BinNode } from './binary_tree'
import BST from './bst'

/**
 * 在节点p与lc之间建立父子关系（左）
 */
function attachAsLChild<T>(p: BinNode<T>, lc: BinNode<T>) {
    p.lc = lc
    if (lc) lc.parent = p
}

/**
 * 在节点p与lc之间建立父子关系（右）
 */
function attachAsRChild<T>(p: BinNode<T>, rc: BinNode<T>) {
    p.rc = rc
    if (rc) rc.parent = p
}

class Splay<T> extends BST<T> {
    /**
     * Splay树伸展算法：从节点v出发逐层伸展，v为最近访问而需伸展的节点位置
     */
    protected splay(v: BinNode<T>) {
        if (!v) return null
        let p: BinNode<T>, g: BinNode<T> // v的父级和祖父级
        // 每轮之后v都以原曾祖父为父
        while ((p = v.parent) && (g = p.parent)) {
            let gg = g.parent
            if (v.isLChild()) {
                // zig-zig
                if (p.isLChild()) {
                    attachAsLChild(g, p.rc)
                    attachAsLChild(p, v.rc)
                    attachAsRChild(p, g)
                    attachAsRChild(v, p)
                }
                // zig-zag
                else {
                    attachAsLChild(p, v.rc)
                    attachAsRChild(g, v.lc)
                    attachAsLChild(v, g)
                    attachAsRChild(v, p)
                }
            }
            // zag-zag
            else if (p.isRChild()) {
                attachAsRChild(g, p.lc)
                attachAsRChild(p, v.lc)
                attachAsLChild(p, g)
                attachAsLChild(v, p)
            }
            // zag-zig
            else {
                attachAsRChild(p, v.lc)
                attachAsLChild(g, v.rc)
                attachAsRChild(v, g)
                attachAsLChild(v, p)
            }
            // 若v原先的曾祖父gg不存在，则v现在应为树根
            if (!gg) {
                v.parent = null
            }
            // 否则，gg伺候应该以v作为左/右子级
            else {
                g === gg.lc ? attachAsLChild(gg, v) : attachAsRChild(gg, v)
            }
            this.updateHeight(g)
            this.updateHeight(p)
            this.updateHeight(v)
        } // 双层伸展结束时，必有g === null，当p可能为非空
        // 若p果真非空，则额外做一次单旋
        if ((p = v.parent)) {
            if (v.isLChild()) {
                attachAsLChild(p, v.rc)
                attachAsRChild(v, p)
            } else {
                attachAsRChild(p, v.lc)
                attachAsLChild(v, p)
            }
            this.updateHeight(p)
            this.updateHeight(v)
        }
        v.parent = null
        return v
    }

    search(e: T) {
        let p = super.search(e)
        // 将最后一个被访问的节点伸展至根
        this._root = this.splay(p ? p : this._hot)
        return this._root
    }

    insert(e: T) {
        // 处理原树为空的退化情况
        if (!this._root) {
            this._size++
            return (this._root = new BinNode(e))
        }
        // 确认目标节点存在
        if (e === this.search(e).data) return this._root
        this._size++
        // 创建新节点
        let t = this._root
        // 插入新根，以t和t.rc为左、右子级
        if (this._root.data < e) {
            t.parent = this._root = new BinNode(e, null, t, t.rc)
            if (t.hasRChild()) {
                t.rc.parent = this._root
                t.rc = null
            }
        }
        // 插入新根，以t和t.lc为左、右子级
        else {
            t.parent = this._root = new BinNode(e, null, t.lc, t)
            if (t.hasLChild()) {
                t.lc.parent = this._root
                t.lc = null
            }
        }
        this.updateHeightAbove(t) // 更新t及其祖先的高度
        return this._root
    }

    remove(e: T) {
        // 若树空或目标不存在，则无法删除
        if (!this._root || e !== this.search(e).data) return false
        let w = this._root // 经search后节点e已经被伸展至树根
        // 若无左子树，直接删除
        if (!this._root.hasLChild()) {
            this._root = this._root.rc
            if (this._root) this._root.parent = null
        }
        // 若无右子树，也直接删除
        else if (!this._root.hasRChild()) {
            this._root = this._root.lc
            if (this._root) this._root.parent = null
        }
        // 若左右子树同时存在，则
        else {
            let lTree = this._root.lc
            // 暂时摘除左子树，只保留右子树
            lTree.parent = null
            this._root.lc = null
            this._root = this._root.rc
            this._root.parent = null
            // 以原树根为目标，做一次（必定失败的）查找
            this.search(w.data)
            // 至此，右子树中国最小节点必伸展至根，且（无雷同节点）其左子树必空，于是
            // 只需将原左子树接回原位即可
            this._root.lc = lTree
            lTree.parent = this._root
        }
        this._size--
        // 若树非空，则树根的高度需要更新
        if (this._root) this.updateHeight(this._root)
        return true
    }
}

export default Splay
