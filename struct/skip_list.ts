import { Ref } from '../common/types'
import { createRef, rand } from '../common/util'
import Dictionary from '../interface/dictionary'
import Entry from './entry'
import List, { ListNode } from './list'
import QuadList, { QuadListNode } from './quad_list'

class SkipList<K, V> implements Dictionary<K, V> {
    private _list = new List<QuadList<Entry<K, V>>>()
    /******************************************************************************************
     * Skiplist词条查找算法（供内部调用）
     * 入口：qlist为顶层列表，p为qlist的首节点
     * 出口：若成功，p为命中关键码所属塔的顶部节点，qlist为p所属列表
     *       否则，p为所属塔的基座，该塔对应于不大于k的最大且最靠右关键码，qlist为空
     * 约定：多个词条命中时，沿四联表取最靠后者
     ******************************************************************************************/
    protected skipSearch(qlist: ListNode<QuadList<Entry<K, V>>>, pRef: Ref<QuadListNode<Entry<K, V>>>, k: K) {
        let p = pRef.value
        // 在每一层
        while (true) {
            // 从前向后查找
            while (p.succ && p.entry.key <= k) {
                // 直到出现更大的key或溢出trailer
                p = p.succ
            }
            // 此时倒回一步，即可判断是否
            pRef.value = p = p.pred
            // 命中
            if (p.pred && k === p.entry.key) return true
            // 转入下一层
            qlist = qlist.succ
            // 若已穿透底层，则意味着失败
            if (!qlist.succ) return false
            // 否则转至当前的塔的下一个节点
            pRef.value = p = p.pred ? p.below : qlist.data.first()
        }
    }
    size() {
        return this.empty() ? 0 : this._list.last().data.size()
    }
    empty() {
        return this._list.empty()
    }
    level() {
        return this._list.size()
    }
    put(k: K, v: V): boolean {
        let e = new Entry<K, V>(k, v) // 待插入的词条（将被随机地插入多个副本）
        if (this.empty()) this._list.insertAsFirst(new QuadList<Entry<K, V>>()) // 插入首个Entry
        let qlist = this._list.first() // 从顶层四联表的
        let p = qlist.data.first() // 首个节点出发
        // 查找适当的插入位置（不大于关键码k的最后一个节点p）
        let pRef = createRef(p)
        if (this.skipSearch(qlist, pRef, k)) {
            // 若已有雷同词条，则需强制转到塔底
            while (pRef.value.below) pRef.value = pRef.value.below
        }
        p = pRef.value
        // 以下，紧邻于p的右侧，一座新塔将自底而上逐层生长
        qlist = this._list.last()
        let b = qlist.data.insertAfterAbove(e, p) // 新节点b即新塔基座
        // 经投掷硬币，若确定新塔需要再长高一层，则
        while (rand(10) % 2) {
            // 找出不低于此高度的最近前驱
            while (qlist.data.valid(p) && !p.above) p = p.pred
            // 若该前驱是header
            if (!qlist.data.valid(p)) {
                // 且目前已是最顶层，则意味着必须
                if (qlist === this._list.first()) {
                    // 首先创建新的一层，然后
                    this._list.insertAsFirst(new QuadList<Entry<K, V>>())
                }
                // 将p转至上一层SkipList的header
                p = qlist.pred.data.first().pred
            }
            // 否则，可径自
            else {
                p = p.above // 将p提示至该高度
            }
            qlist = qlist.pred // 上升一层，并在该层
            b = qlist.data.insertAfterAbove(e, p, b) // 将新节点插入p之后，b之上
        }
        return true
    }
    get(k: K): V {
        if (this._list.empty()) return null
        let qlist = this._list.first() // 从顶层QuadList出发
        let p = qlist.data.first() // 从首节点开始
        let pRef = createRef(p)
        return this.skipSearch(qlist, pRef, k) ? pRef.value.entry.value : null // 操作并报告
    }
    remove(k: K): boolean {
        if (this.empty()) return false
        let qlist = this._list.first()
        let p = qlist.data.first()
        // 查找适当的插入位置（不大于关键码k的最后一个节点p）
        let pRef = createRef(p)
        if (!this.skipSearch(qlist, pRef, k)) return false
        p = pRef.value
        do {
            let lower = p.below
            qlist.data.remove(p)
            p = lower
            qlist = qlist.succ
        } while (qlist.succ)
        while (!this.empty() && this._list.first().data.empty()) {
            this._list.remove(this._list.first())
        }
        return true
    }
}

export default SkipList
