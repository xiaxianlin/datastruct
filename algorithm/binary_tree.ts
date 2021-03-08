import { VST } from '../common/types'
import BinTree, { BinNode } from '../struct/binary_tree'

/**
 * 先序遍历，递归版
 */
export function trvaPre_R<T>(x: BinNode<T>, visit: VST<T>) {
    if (!x) return
    visit(x.data)
    trvaPre_R(x.lc, visit)
    trvaPre_R(x.rc, visit)
}

/**
 * 中序遍历，递归版
 */
export function trvaIn_R<T>(x: BinNode<T>, visit: VST<T>) {
    if (!x) return
    trvaPost_R(x.lc, visit)
    visit(x.data)
    trvaPost_R(x.rc, visit)
}

/**
 * 后序遍历，递归版
 */
export function trvaPost_R<T>(x: BinNode<T>, visit: VST<T>) {
    if (!x) return
    trvaPost_R(x.lc, visit)
    trvaPost_R(x.rc, visit)
    visit(x.data)
}
