import Vector from './vector'

export class BTNode<T> {
    parent: BTNode<T> // 父节点
    key: Vector<T> // 关键码向量
    child: Vector<BTNode<T>> // 子级，长度总比key多1
    // BTNode只能作为根节点创建吗，而且初始时有0个关键码和1个空子级
    constructor(e?: T, lc: BTNode<T> = null, rc: BTNode<T> = null) {
        this.key = new Vector()
        this.child = new Vector()
        if (e) {
            this.parent = null // 作为根节点初始化
            this.key.insert(e) // 只要一个关键码
            // 以及两个子级
            this.child.insert(lc)
            this.child.insert(rc)
        } else {
            this.parent = null
            this.child.insert(null)
        }
    }
}

class BTree<T> {
    protected _size: number // 存放关键码总数
    protected _order: number // B-树的阶次，至少为3 -- 创建时指定，一般不能修改
    protected _root: BTNode<T> // 根节点
    protected _hot: BTNode<T> // search()最后访问的非空（除非树空）的节点位置
    // 因插入而上溢之后的分裂处理
    protected solveOverflow(v: BTNode<T>) {
        if (this._order >= v.child.size()) return // 递归基：当前节点并未上溢
        let s = Math.floor(this._order / 2) // 轴点（此时应有_order = key.size() = child.size() - 1）
        let u = new BTNode<T>() // 注意：新节点已有一个子节点
        let m = this._order - s - 1 // 分裂点
        // v右侧_order-s-1个子级及关键码分裂为右侧节点
        for (let j = 0; j < m; j++) {
            u.child.insertAt(j, v.child.remove(s + 1))
            u.key.insertAt(j, v.key.remove(s + 1))
        }
        u.child.put(m, v.child.remove(s + 1)) // 移动v最靠右的子级
        // 若u的子节点们非空，则
        if (u.child.get(0)) {
            // 令它们的父节点统一
            for (let j = 0; j < this._order - s; j++) {
                u.child.get(j).parent = u // 指向u
            }
        }
        let p = v.parent // v当前的父节点p
        // 若p为空，则创建之
        if (!p) {
            this._root = p = new BTNode<T>()
            p.child.put(0, v)
            v.parent = p
        }
        let r = 1 + p.key.search(v.key.get(0)) // p中指向u的对象的秩
        p.key.insertAt(r, v.key.remove(s)) // 轴点关键码上升
        // 新节点u和父节点p互联
        p.child.insertAt(r + 1, u)
        u.parent = p
        this.solveOverflow(p) // 上升一层，如有必要则继续分裂 -- 至多递归O(logn)层
    }
    // 因删除而下溢之后的合并处理
    protected solveUnderflow(v: BTNode<T>) {
        if ((this._order + 1) / 2 <= v.child.size()) return // 递归基：当前节点并未下溢
        let p = v.parent
        // 递归基：已到根节点，没有子节点的下限
        if (!p) {
            if (!v.key.size() && v.child.get(0)) {
                // 但倘若作为树根的v已不含关键码，却有（唯一的）非空子节点，则这个节点可被跳过
                this._root = v.child.get(0)
                this._root.parent = null
                v.child.put(0, null)
            } // 整数高度降低一层
            return
        }

        let r = 0
        while (p.child.get(r) !== v) r++
        // 确定v是p的第r个子节点--此时v可能不含关键码，故不能通过关键码查   找
        // 另外，在实现了子节点的判等器之后，也可直接调用Vectro.find()定位

        // 情况1：向左兄弟借关键码
        // 若v不是p的第一个子节点，则
        if (0 < r) {
            let ls = p.child.get(r - 1) // 左兄弟必存在
            // 若该兄弟及诶单足够“胖”，则
            if ((this._order + 1) / 2 < ls.child.size()) {
                v.key.insertAt(0, p.key.get(r - 1)) // p借出一个关键码给v（作为最小关键码）
                p.key.put(r - 1, ls.key.remove(ls.key.size() - 1)) // ls的最大码转入p
                v.child.insertAt(0, ls.child.remove(ls.child.size() - 1))
                // 同时ls的最右侧子节点过继给v
                if (v.child.get(0)) v.child.get(0).parent = v // 作为v的最左侧子节点
                return // 至此，通过右旋已完成当前层（以及所有层）的下溢处理
            }
        } // 至此，左兄弟要么为空，要么太“瘦”

        // 情况2：向右兄弟借关键码
        // 若v不是p的最后一个子节点，则
        if (p.child.size() - 1 > r) {
            let rs = p.child.get(r + 1) // 右兄弟必存在
            // 若该兄弟足够“胖”，则
            if ((this._order + 1) / 2 < rs.child.size()) {
                v.key.insertAt(v.key.size(), p.key.get(r)) // p借出一个关键码给v（作为最大码）
                p.key.put(r, rs.key.remove(0)) // rs的最小关键码转入p
                v.child.insertAt(v.child.size(), rs.child.remove(0))
                // 同时rs的最左侧子节点过继给v，作为v的最右子节点
                if (v.child.get(v.child.size() - 1)) v.child.get(v.child.size() - 1).parent = v
                return // 至此，通过左旋已完成当前层（以及所有层）的下溢处理
            }
        } // 至此，右兄弟要么为空，要么太“瘦”

        // 情况3：左、右兄弟要么为空（但不可能同时），要么都太“瘦”--合并
        // 与左兄弟合并
        if (0 < r) {
            let ls = p.child.get(r - 1) // 左兄弟必存在
            ls.key.insertAt(ls.key.size(), p.key.remove(r - 1))
            p.child.remove(r)
            // p的r - 1个关键码转入ls，v不再是p的第r个子节点
            ls.child.insertAt(ls.child.size(), v.child.remove(0))
            // v的最左侧子节点过继给ls做最右侧子节点
            if (ls.child.get(ls.child.size() - 1)) ls.child.get(ls.child.size() - 1).parent = ls
            // v剩余的关键码和子节点，依次转入ls
            while (!v.key.empty()) {
                ls.key.insertAt(ls.key.size(), v.key.remove(0))
                ls.child.insertAt(ls.child.size(), v.child.remove(0))
                if (ls.child.get(ls.child.size() - 1)) ls.child.get(ls.child.size() - 1).parent = ls
            }
        }
        // 与右兄弟合并
        else {
            let rs = p.child.get(r + 1) // 右兄弟必存在
            rs.key.insertAt(0, p.key.remove(r))
            p.child.remove(r)
            // p的第r个关键码转入rs，v不再是p的第r个子节点
            rs.child.insertAt(0, v.child.remove(v.child.size() - 1))
            // v的最右侧子节点过继给rs做最左侧子节点
            if (rs.child.get(0)) rs.child.get(0).parent = rs
            // v剩余的关键码和子节点，依次转入rs
            while (!v.key.empty()) {
                rs.key.insertAt(0, v.key.remove(v.key.size() - 1))
                rs.child.insertAt(0, v.child.remove(v.child.size() - 1))
                if (rs.child.get(0)) rs.child.get(0).parent = rs
            }
        }
        this.solveUnderflow(p) // 上升一层，如有必要则继续分裂--至多递归O(logn)层
        return
    }

    constructor(order: number = 3) {
        this._size = 0
        this._order = order
        this._root = new BTNode<T>()
    }
    // 阶次
    order() {
        return this._order
    }
    // 规模
    size() {
        return this._size
    }
    // 树根
    root() {
        return this._root
    }
    // 判空
    emtpy() {
        return !this._root
    }
    // 查找
    search(e: T) {
        // 从根节点出发
        let v = this._root
        this._hot = null
        // 逐层查找
        while (v) {
            let r = v.key.search(e) // 在当前节点中，找到不大于e的最大关键码
            if (0 <= r && e === v.key.get(r)) return v // 成功：在当前节点中命中目标关键码
            this._hot = v // 否则，转入对应子树（_hot指向其父）
            v = v.child.get(r + 1)
        } // 这里在向量内是二分查找，但对通常的_order可直接顺序查找
        return null // 失败：最终抵达外部节点
    }
    // 插入
    insert(e: T) {
        // 确认目标节点不存在
        let v = this.search(e)
        if (v) return false
        let r = this._hot.key.search(e) // 在节点_hot的有序关键码向量中查找合适的插入位置
        this._hot.key.insertAt(r + 1, e) // 将新关键码插至对应的位置
        this._hot.child.insertAt(r + 2, null) // 创建一个空子树
        this._size++ // 更新全树规模
        this.solveOverflow(this._hot) // 如有必要，需做分裂
        return true
    }
    // 删除
    remove(e: T) {
        // 确认目标关键码存在
        let v = this.search(e)
        if (!v) return false
        let r = v.key.search(e) // 在确定目标关键码在节点v中的秩
        // 若v非叶子，则e的后继必属于某叶节点
        if (v.child.get(0)) {
            let u = v.child.get(r + 1) // 若右子树一直向左，即可
            while (u.child.get(0)) u = u.child.get(0) // 找出e的后继
            // 并与之交换位置
            v.key.put(r, u.key.get(0))
            v = u
            r = 0
        } // 至此，v必然位于最底层，且其中第r个关键码就是待删除者
        // 删除e，以及其下两个外部节点之一
        v.key.remove(r)
        v.child.remove(r + 1)
        this._size--
        // 如有必要，需做旋转或合并
        this.solveUnderflow(v)
        return true
    }
}

export default BTree
