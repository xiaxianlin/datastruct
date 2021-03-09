import {
    travIn_I1,
    travIn_I2,
    travIn_I3,
    travIn_R,
    travLevel,
    travPost_I,
    travPost_R,
    travPre_I2,
    travPre_R
} from '../algorithm/binary_tree'
import { RBColor, VST } from '../common/types'
/**
 * 高度
 * @param 获取节点p的高度
 */
function stature<T>(p: BinNode<T>) {
    // 在红黑树中，NULL视做外部节点，对应于0
    if (p && p.color > RBColor.NONE) {
        return p ? p.height : 0
    }
    // 其余BST中节点的高度（NULL视作空树，对应于-1）
    return p ? p.height : -1
}

export class BinNode<T> {
    data: T = null
    parent: BinNode<T> = null
    lc: BinNode<T> = null
    rc: BinNode<T> = null
    height: number = 0
    npl: number = 1 // Nul Path Length
    color: RBColor = RBColor.NONE

    // setter
    setParent(parent: BinNode<T>) {
        return new BinNode(this.data, parent, this.lc, this.rc, this.height, this.npl, this.color)
    }
    setLc(lc: BinNode<T>) {
        return new BinNode(this.data, this.parent, lc, this.rc, this.height, this.npl, this.color)
    }
    setRc(rc: BinNode<T>) {
        return new BinNode(this.data, this.parent, this.lc, rc, this.height, this.npl, this.color)
    }
    setHeight(h: number) {
        return new BinNode(this.data, this.parent, this.lc, this.rc, h, this.npl, this.color)
    }
    setNpl(l: number) {
        return new BinNode(this.data, this.parent, this.lc, this.rc, l, this.npl, this.color)
    }
    setColor(color: RBColor) {
        return new BinNode(this.data, this.parent, this.lc, this.rc, this.height, this.npl, color)
    }

    // piblic
    constructor(
        e: T,
        p: BinNode<T> = null,
        lc: BinNode<T> = null,
        rc: BinNode<T> = null,
        h: number = 0,
        l: number = 1,
        c: RBColor = RBColor.NONE
    ) {
        this.data = e
        this.parent = p
        this.lc = lc
        this.rc = rc
        this.height = h
        this.npl = l
        this.color = c
    }
    // 统计当前节点后代总数，亦即以其为根的子树的规模
    size() {
        let s = 1
        if (this.lc) {
            s += this.lc.size()
        }
        if (this.rc) {
            s += this.rc.size()
        }
        return s
    }
    // 作为当前节点的左子节点插入新节点
    insertAsLC(e: T) {
        let lc = new BinNode(e, this)
        this.lc = lc
        return lc
    }
    // 作为当前节点的右子节点插入新节点
    insertAsRC(e: T) {
        let rc = new BinNode(e, this)
        this.rc = rc
        return rc
    }
    // 取当前节点的后继节点
    succ() {
        let s: BinNode<T> = this
        // 若有右子节点，则直接后继必在右子树中
        if (this.rc) {
            s = this.rc // 右子树
            while (s.hasLChild()) s = s.lc // 取最左（最小）的节点
        }
        // 否则，直接后继应是“将当前节点包含于其左子树中的最低祖先”
        else {
            while (s.isRChild()) s = s.parent // 逆向地沿右向分支，不断的朝左上方移动
            s = s.parent // 最后一步再朝右上方移动一步，即抵达直接后续（若存在）
        }
        return s
    }
    // 子树层次遍历
    travLevel(visit: VST<T>) {
        let data = []
        travLevel(this, (e) => {
            data.push(e)
            visit(e)
        })
        console.log('[level] data :', data.join(', '))
    }
    // 子树先序遍历
    travPre(visit: VST<T>) {
        let rData = []
        travPre_R(this, (e) => {
            rData.push(e)
            visit(e)
        })
        console.log('[pre] rData :', rData.join(', '))

        let iData = []
        travPre_I2(this, (e) => {
            iData.push(e)
            visit(e)
        })
        console.log('[pre] iData :', iData.join(', '))
    }
    // 子树中序遍历
    travIn(visit: VST<T>) {
        let rData = []
        travIn_R(this, (e) => {
            rData.push(e)
            visit(e)
        })
        console.log('[in] rData :', rData.join(', '))

        let i1Data = []
        travIn_I1(this, (e) => {
            i1Data.push(e)
            visit(e)
        })
        console.log('[in] i1Data :', i1Data.join(', '))

        let i2Data = []
        travIn_I2(this, (e) => {
            i2Data.push(e)
            visit(e)
        })
        console.log('[in] i2Data :', i2Data.join(', '))

        let i3Data = []
        travIn_I3(this, (e) => {
            i3Data.push(e)
            visit(e)
        })
        console.log('[in] i3Data :', i3Data.join(', '))
    }
    // 子树后序遍历
    travPost(visit: VST<T>) {
        let rData = []
        travPost_R(this, (e) => {
            rData.push(e)
            visit(e)
        })
        console.log('[post] rData :', rData.join(', '))
        let iData = []
        travPost_I(this, (e) => {
            iData.push(e)
            visit(e)
        })
        console.log('[post] iData :', iData.join(', '))
    }
    // 与本节点比较，-1是小于本节点，0是等于本节点，1是大于本节点
    compare(node: BinNode<T>) {
        if (this.data === node.data) return 0
        if (this.data > node.data) return -1
        if (this.data < node.data) return 1
    }

    isRoot() {
        return !this.parent
    }
    isLChild() {
        return !this.isRoot() && this === this.parent.lc
    }
    isRChild() {
        return !this.isRoot() && this === this.parent.rc
    }
    isLeaf() {
        return !this.hasChild()
    }
    hasParent() {
        return !this.isRoot()
    }
    hasLChild() {
        return !!this.lc
    }
    hasRChild() {
        return !!this.rc
    }
    hasChild() {
        return this.hasLChild() || this.hasRChild()
    }
    hasBothChild() {
        return this.hasLChild() && this.hasRChild()
    }
    sibling() {
        return this.isLChild() ? this.parent.rc : this.parent.lc
    }
    uncle() {
        this.parent.isLChild() ? this.parent.parent.rc : this.parent.parent.lc
    }
}

class BinTree<T> {
    static Node = BinNode
    // 规模
    protected _size: number = 0
    // 根节点
    protected _root: BinNode<T> = null

    // 更新节点x的高度
    protected updateHeight(x: BinNode<T>) {
        return (x.height = 1 + Math.max(stature(x.lc), stature(x.rc)))
    }
    // 更新节点x及其祖先的高度
    protected updateHeightAbove(x: BinNode<T>) {
        while (x) {
            this.updateHeight(x)
            x = x.parent
        }
    }
    // 切断引用
    protected cutRef(x: BinNode<T>) {
        if (x.isRoot()) {
            this._root = null
        } else {
            if (x.isLChild()) {
                x.parent.lc = null
            }
            if (x.isRChild()) {
                x.parent.rc = null
            }
        }
    }

    constructor() {}
    // 获取规模
    size() {
        return this._size
    }
    // 判断是否为空
    empty() {
        return !this._root
    }
    // 获取根节点
    root() {
        return this._root
    }
    // 插入根节点
    insertAsRoot(e: T) {
        this._size = 1
        return (this._root = new BinNode(e))
    }
    // e作为x的左子节点（无）插入
    insertAsLC(x: BinNode<T>, e: T) {
        this._size++
        x.insertAsLC(e)
        this.updateHeightAbove(x)
        return x.lc
    }
    // e作为x的右子节点（无）插入
    insertAsRC(x: BinNode<T>, e: T) {
        this._size++
        x.insertAsRC(e)
        this.updateHeightAbove(x)
        return x.rc
    }
    // T作为x左子树接入
    attachAsLC(x: BinNode<T>, S: BinTree<T>) {
        // 接入
        if ((x.lc = S._root)) x.lc.parent = x
        // 更新规模
        this._size += S._size
        // 更新x所有祖先的高度
        this.updateHeightAbove(x)
        return x
    }
    // T作为x右子树接入
    attachAsRC(x: BinNode<T>, S: BinTree<T>) {
        // 接入
        if ((x.rc = S._root)) x.rc.parent = x
        // 更新规模
        this._size += S._size
        // 更新x所有祖先的高度
        this.updateHeightAbove(x)
    }
    // 删除以位置x处节点为根的子树，返回该子树的原先规模
    remove(x: BinNode<T>) {
        // 切断引用
        this.cutRef(x)
        // 更新祖先高度
        this.updateHeightAbove(x.parent)
        // 计算删除规模
        let n = this.removeSize(x)
        // 更新规模
        this._size -= n
        return n
    }
    // 删除规模
    removeSize(x: BinNode<T>) {
        if (!x) return 0
        let n = 1 + this.removeSize(x.lc) + this.removeSize(x.rc)
        return n
    }
    // 将子树x从当前树中摘除，并将其转换为一颗独立子树
    secede(x: BinNode<T>) {
        // 切断引用
        this.cutRef(x)
        // 更新祖先高度
        this.updateHeightAbove(x.parent)
        // 构建新树
        let S = new BinTree<T>()
        S._root = x
        x.parent = null
        S._size = x.size()
        this._size -= S._size
        return S
    }
    // 层次遍历
    travLevel(visit: VST<T>) {
        if (this._root) this._root.travLevel(visit)
    }
    // 先序遍历
    travPre(visit: VST<T>) {
        if (this._root) this._root.travPre(visit)
    }
    // 中序遍历
    travIn(visit: VST<T>) {
        if (this._root) this._root.travIn(visit)
    }
    // 后序遍历
    travPost(visit: VST<T>) {
        if (this._root) this._root.travPost(visit)
    }
    // 比较
    compare(t: BinTree<T>) {}
    // 是否是完全二叉树
    isCompleteBinTree() {
        let h = this._root.height
        return this._size >= Math.pow(2, h) && this._size <= Math.pow(2, h + 1) - 1
    }
    // 是否是满二叉树
    isFullBinTree() {
        return this._size === Math.pow(2, this._root.height + 1) - 1
    }
}

export default BinTree
