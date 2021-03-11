import { VST } from '../common/types'
import BinTree, { BinNode } from '../struct/binary_tree'
import Stack from '../struct/stack'
import Queue from '../struct/queue'
import Vector from '../struct/vector'
import { rand } from '../common/util'
import Bitmap from '../common/bitmap'
// 从当前节点出发，沿左分支不断深入，直到没有左分支的节点；沿途节点遇到后立即访问
function visitAlongLeftBranch<T>(x: BinNode<T>, visit: VST<T>, S: Stack<BinNode<T>>) {
    while (x) {
        visit(x.data) // 访问当前节点
        S.push(x.rc) // 右子节点入栈
        x = x.lc // 沿左分支深入一层
    }
}

// 从当前节点出发，沿左分支不断深入，直到没有左分支的节点
function goAlongLeftBranch<T>(x: BinNode<T>, S: Stack<BinNode<T>>) {
    while (x) {
        S.push(x)
        x = x.lc
    }
}

// 在以S栈顶节点为根的子树中，找到最高左侧可见叶节点，沿途所遇节点依次入栈
function gotoHLVFL<T>(S: Stack<BinNode<T>>) {
    let x: BinNode<T>
    // 自顶而下，反复检查当前节点
    while ((x = S.top())) {
        // 尽可能向左
        if (x.hasLChild()) {
            if (x.hasRChild()) S.push(x.rc) // 若有右子节点，优先入栈
            S.push(x.lc) // 然后才转至左子节点
        }
        // 实不得以
        else {
            S.push(x.rc) // 才向右
        }
    }
    S.pop() // 返回之前，弹出栈顶的空节点
}

/**
 * 先序遍历，递归版
 */
export function travPre_R<T>(x: BinNode<T>, visit: VST<T>) {
    if (!x) return
    visit(x.data)
    travPre_R(x.lc, visit)
    travPre_R(x.rc, visit)
}

/**
 * 先序遍历，最左侧通路
 */
export function travPre_I2<T>(x: BinNode<T>, visit: VST<T>) {
    let S = new Stack<BinNode<T>>() // 辅助栈
    while (true) {
        visitAlongLeftBranch(x, visit, S) // 从当前节点出发，逐批访问
        if (S.empty()) break // 直到栈空
        x = S.pop() // 弹出下一批的起点
    }
}

/**
 * 中序遍历，递归版
 */
export function travIn_R<T>(x: BinNode<T>, visit: VST<T>) {
    if (!x) return
    travIn_R(x.lc, visit)
    visit(x.data)
    travIn_R(x.rc, visit)
}

/**
 * 中序遍历，最左侧通路
 */
export function travIn_I1<T>(x: BinNode<T>, visit: VST<T>) {
    let S = new Stack<BinNode<T>>() // 辅助栈
    while (true) {
        goAlongLeftBranch(x, S) // 从当前节点出发，逐批访问
        if (S.empty()) break // 直到栈空
        x = S.pop() // 弹出下一批的起点
        visit(x.data)
        x = x.rc // 转向右子树
    }
}

/**
 * 中序遍历，最左侧通路进阶版
 */
export function travIn_I2<T>(x: BinNode<T>, visit: VST<T>) {
    let S = new Stack<BinNode<T>>() // 辅助栈
    while (true) {
        if (x) {
            S.push(x) // 根节点入栈
            x = x.lc // 深入遍历左子树
        } else if (!S.empty()) {
            x = S.pop() // 尚未访问的最低祖先节点退栈
            visit(x.data) // 访问该祖先节点
            x = x.rc // 遍历祖先右子树
        } else {
            break
        }
    }
}

/**
 * 中序遍历，直接后继版
 */
export function travIn_I3<T>(x: BinNode<T>, visit: VST<T>) {
    let backtrack = false // 前一步是否刚从右子树回溯
    while (true) {
        // 若有左子树且不是刚刚回溯
        if (!backtrack && x.hasLChild()) {
            x = x.lc // 深入遍历左子树
        }
        // 否则，无左子树或刚刚回溯
        else {
            visit(x.data)
            // 若其右子树为空
            if (x.hasRChild()) {
                x = x.rc // 深入右子树继续遍历
                backtrack = false // 并关闭回溯标志
            }
            // 若右子树为空
            else {
                if (!(x = x.succ())) break // 回溯（含抵达末节点时的退出返回）
                backtrack = true // 并设置回溯标志
            }
        }
    }
}

/**
 * 后序遍历，递归版
 */
export function travPost_R<T>(x: BinNode<T>, visit: VST<T>) {
    if (!x) return
    travPost_R(x.lc, visit)
    travPost_R(x.rc, visit)
    visit(x.data)
}

/**
 * 后序遍历，迭代版
 */
export function travPost_I<T>(x: BinNode<T>, visit: VST<T>) {
    let S = new Stack<BinNode<T>>() // 辅助栈
    if (x) S.push(x) // 根节点入栈
    while (!S.empty()) {
        // 若栈顶非当前节点之父（则必为其兄），此时需在以其右兄为根之子树中，找到HLVFL（相当于递归深入其中）
        if (S.top() !== x.parent) gotoHLVFL(S)
        // 弹出栈顶（即前一节点之后继）
        x = S.pop()
        visit(x.data)
    }
}

/**
 * 层级遍历
 */
export function travLevel<T>(x: BinNode<T>, visit: VST<T>) {
    let Q = new Queue<BinNode<T>>() // 辅助队列
    Q.enqueue(x) // 根节点入队
    while (!Q.empty()) {
        x = Q.dequeue() // 拿出父节点
        visit(x.data) // 访问节点
        if (x.hasLChild()) Q.enqueue(x.lc) // 左子节点入队
        if (x.hasRChild()) Q.enqueue(x.rc) // 右子节点入队
    }
}

/**********PFC编码及解码**********/

type PFCTree = BinTree<any>
type PFCForest = Vector<PFCTree>

const N_CHAR = 0x80 - 0x20
/**
 * 初始化PFC森林
 */
function initForest() {
    let forest = new Vector<PFCTree>()
    for (let i = 0; i < N_CHAR; i++) {
        forest.insertAt(i, new BinTree<any>())
        forest.get(i).insertAsRoot(0x20 + i)
    }
    return forest
}

/**
 * 构造PFC编码树
 */
function generateTree(forest: PFCForest) {
    // 共做|forest|-1次合并
    while (1 < forest.size()) {
        // 创建新树（根标记为^）
        let s = new BinTree<any>()
        s.insertAsRoot('^')
        // 随机选取r1，且作为左子树接入，然后剔除
        let r1 = rand(forest.size())
        s.attachAsLC(s.root(), forest[r1])
        forest.remove(r1)
        // 随机选取r2，且作为右子树接入，然后剔除
        let r2 = rand(forest.size())
        s.attachAsRC(s.root(), forest[r2])
        forest.remove(r2)
        // 合并后的PFC树重新植入PFC森林
        forest.insert(s)
    }
    // 至此，森林中尚存最后一棵树，即全局PFC编码
    return forest[0]
}

function generateCT(code: Bitmap, length: number) {}
