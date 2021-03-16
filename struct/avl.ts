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
    protected rotate(g: BinNode<T>) {
        // 缓存g的属性，用于后续重新接入
        if (!g.avlBalanced()) {
            this.relinkAfterRotateAt(g, this.tallerChild(this.tallerChild(g)))
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
        this.linkInsertNode(x)
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
