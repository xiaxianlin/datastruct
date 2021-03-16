import { RBColor } from '../common/types'
import { BinNode, stature } from './binary_tree'
import BST from './bst'

const { RB_BLACK, RB_RED } = RBColor

// 外部节点也是黑节点
function isBlack<T>(p: BinNode<T>) {
    return !p || p.color === RB_BLACK
}
// 非黑即红
function isRed<T>(p: BinNode<T>) {
    return !isBlack(p)
}

// 高度更新条件
function blackHeightUpdated<T>(x: BinNode<T>) {
    return stature(x.lc) === stature(x.rc) && x.height === (isRed(x) ? stature(x.lc) : stature(x.lc) + 1)
}

class RedBlackTree<T> extends BST<T> {
    /******************************************************************************************
     * RedBlack双红调整算法：解决节点x与其父均为红色的问题。分为两大类情况：
     *    RR-1：2次颜色翻转，2次黑高度更新，1~2次旋转，不再递归
     *    RR-2：3次颜色翻转，3次黑高度更新，0次旋转，需要递归
     ******************************************************************************************/
    protected solveDoubleRed(x: BinNode<T>) {
        // 若已（递归）转至树根，则将其转黑，整数黑高度也随之递增
        if (x.isRoot()) {
            this._root.color = RB_BLACK
            this._root.height++
            return
        } // 否则，x的父节点p必存在
        let p = x.parent
        if (isBlack(p)) return // 若p为黑，则可终止调整，否则
        let g = p.parent // 既然p为红，则x的祖父必存在，，且必为黑色
        let u = x.uncle() // 以下，视x叔父u的颜色分别处理
        // u为黑色（含null）时
        if (isBlack(u)) {
            // 若x与p同侧（即zig-zig或zag-zag），则
            if (x.isLChild() === p.isLChild()) {
                p.color = RB_BLACK // p由红转黑，x保持红
            }
            // 若x与p异侧（即zig-zag或zag-zig），则
            else {
                x.color = RB_BLACK // x由红转黑，p保持红
            }
            g.color = RB_RED // g必定由黑转红
            // 以上虽保证总共两次染色，但因证据了判断而得不偿失
            // 在旋转后将根置黑，子节点置红，虽需三次染色但效率更高
            let gg = g.parent // 曾祖父
            // 调整后的子树根节点
            let subTree = this.relinkAfterRotateAt(g, x)
            subTree.parent = gg // 与原曾祖父联接
        }
        // 若u为红色
        else {
            // p由红转黑
            p.color = RB_BLACK
            p.height++
            // u由红转黑
            u.color = RB_BLACK
            u.height++
            if (!g.isRoot()) g.color = RB_RED // g若非根，则转红
            this.solveDoubleRed(g) // 继续调整g（类似尾递归，可优化为迭代形式）
        }
    }
    /******************************************************************************************
     * RedBlack双黑调整算法：解决节点x与被其替代的节点均为黑色的问题
     * 分为三大类共四种情况：
     *    BB-1 ：2次颜色翻转，2次黑高度更新，1~2次旋转，不再递归
     *    BB-2R：2次颜色翻转，2次黑高度更新，0次旋转，不再递归
     *    BB-2B：1次颜色翻转，1次黑高度更新，0次旋转，需要递归
     *    BB-3 ：2次颜色翻转，2次黑高度更新，1次旋转，转为BB-1或BB2R
     ******************************************************************************************/
    protected solveDoubleBlack(r: BinNode<T>) {
        // r的父节点
        let p = r ? r.parent : this._hot
        if (!p) return
        // r的兄弟
        let s = r === p.lc ? p.rc : p.lc
        // 兄弟s为黑
        if (isBlack(s)) {
            let t: BinNode<T> = null // s的红子节点（若左、右子节点皆红，左边优先；皆黑时为null）
            if (isRed(s.rc)) t = s.rc // 右子节点
            if (isRed(s.lc)) t = s.lc // 左子节点
            // 黑s有红子节点：BB-1
            if (t) {
                let oldColor = p.color // 备份原子树根节点p的颜色，并对t及其父节点、祖父节点
                // 以下，通过旋转重平衡，并将新子树的左、右子节点染黑
                let b = this.relinkAfterRotateAt(p, t) // 旋转
                // 左子节点
                if (b.hasLChild()) {
                    b.lc.color = RB_BLACK
                    this.updateHeight(b.lc)
                }
                // 右子节点
                if (b.hasRChild()) {
                    b.rc.color = RB_BLACK
                    this.updateHeight(b.rc)
                }
                // 新子树根节点继承原根节点的颜色
                b.color = oldColor
                this.updateHeight(b)
            }
            // 黑s无红子节点：BB-1
            else {
                // s转红
                s.color = RB_RED
                s.height--
                // BB-2R
                if (isRed(p)) {
                    p.color = RB_BLACK // p转黑，但黑高度不变
                }
                // BB-2B
                else {
                    p.height-- // p保持黑，但黑高度下降
                    this.solveDoubleBlack(p) // 递归上溯
                }
            }
        }
        // 兄弟s为红：BB-3
        else {
            s.color = RB_BLACK // s转黑
            p.color = RB_RED // p转红
            let t = s.isLChild() ? s.lc : s.rc // 取t与其父s同侧
            // 对t及其父节点、祖父节点做平衡调整
            this._hot = p
            this.relinkAfterRotateAt(p, t)
            this.solveDoubleBlack(r) // 继续修正r处双黑 -- 此时的p已转红，故后续只能是BB-1或BB-2R
        }
    }
    // 更新节点x的高度，因统一定义stature(null)=-1，故height比黑高度少一，但不影响到各种算法中的比较判断
    protected updateHeight(x: BinNode<T>) {
        x.height = Math.max(stature(x.lc), stature(x.rc)) // 子节点一般黑高度相等，除非出现双黑
        return isBlack(x) ? x.height++ : x.height // 若当前节点为黑，则计入黑深度
    }

    // 插入
    insert(e: T) {
        // 确认目标不存在
        let x = this.search(e)
        if (x) return x
        // 创建红节点x：以_hot为父，黑高度-1
        x = new BinNode<T>(e, this._hot, null, null, -1)
        // 联接新节点
        this.linkInsertNode(x)
        this._size++
        // 经双红修正后，即可返回
        this.solveDoubleRed(x)
        return x ? x : this._hot.parent
    }
    // 删除
    remove(e: T) {
        // 确认目标不存在
        let x = this.search(e)
        if (!x) return false
        // 实施删除
        let r = this.bstRemoveAt(x)
        if (!--this._size) return true
        // _hot某一个子节点被删除，且被r所指节点（可能是null）接替。以下检查是否失衡，并做必要调整
        // 若刚被删除的是根节点，则将其置黑，并更新黑高度
        if (!this._hot) {
            this._root.color = RB_BLACK
            this.updateHeight(this._root)
            return true
        }
        // 以下，原x（现r）必非根，_hot必非空
        // 若所有祖先的黑深度依然平衡，则无需调整
        if (blackHeightUpdated(this._hot)) return true
        // 否则，若r为红，则只需令其转黑
        if (isRed(r)) {
            r.color = RB_BLACK
            r.height++
            return true
        }
        // 以下，原x（现r）均为黑色
        this.solveDoubleBlack(r) // 经双黑调整后返回
        return false
    }
}

export default RedBlackTree
