import BinTree, { BinNode } from '../struct/binary_tree'
import Bitmap from '../struct/bitmap'
import SkipList from '../struct/skip_list'
import Vector from '../struct/vector'

type PFCTree = BinTree<number>
type PFCForest = Vector<PFCTree>
type PFCTable = SkipList<any, string>

const N_CHAR = 0x80 - 0x20
/**
 * 初始化PFC森林
 */
function initForest() {
    // 首先创建空森林，然后
    let forest = new Vector<PFCTree>()
    // 对每一个可打印字符[0x20, 0x80)
    for (let i = 0; i < N_CHAR; i++) {
        // 创建一棵对应的PFC编码树，初始时其中
        forest.insertAt(i, new BinTree<any>())
        // 只包含对应的一个（叶、根）节点
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
        // 创建新树（根标记为' '）
        let s = new BinTree<number>()
        s.insertAsRoot(0x20)
        // 取首个作为左节点
        s.attachAsLC(s.root(), forest.get(0))
        forest.remove(0)
        // 取首个作为右节点
        s.attachAsRC(s.root(), forest.get(0))
        forest.remove(0)
        // 合并后的PFC树重新植入PFC森林
        forest.insert(s)
    }
    // 至此，森林中尚存最后一棵树，即全局PFC编码
    return forest.get(0)
}

/**
 * 通过遍历获取各字符的编码
 */
function generateCT(code: Bitmap, length: number, table: PFCTable, v: BinNode<any>) {
    // 若是叶节点
    if (v.isLeaf()) {
        table.put(v.data, code.bits2string(length))
        return
    }
    // left = 0
    if (v.hasLChild()) {
        code.clear(length)
        generateCT(code, length + 1, table, v.lc)
    }
    // right = 1
    if (v.hasRChild()) {
        code.set(length)
        generateCT(code, length + 1, table, v.rc)
    }
}

/**
 * 构造PFC编码表
 */
function generateTable(tree: PFCTree) {
    // 创建以SkipList实现的编码表
    let table = new SkipList<number, string>()
    // 用于记录RPS的位图
    let code = new Bitmap()
    // 遍历以获取各字符（叶节点）的RPS
    generateCT(code, 0, table, tree.root())
    return table
}

/**
 * 编码
 */
function encode(table: PFCTable, codeString: Bitmap, s: string) {
    let n = 0
    // 对于明文s[]中的每个字符
    for (let m = s.length, i = 0; i < m; i++) {
        let key = s[i].charCodeAt(0)
        // 取出其对应的编码串
        let pCharCode = table.get(key)
        // 小写字母转为大写
        if (!pCharCode) pCharCode = table.get(key - 32)
        // 无法识别的字符统一视作空格
        if (!pCharCode) pCharCode = table.get(' ')
        console.log('pCharCode', pCharCode)
        // 将当前字符的编码接入编码串
        for (let m = pCharCode.length, j = 0; j < m; j++) {
            pCharCode.charAt(j) == '1' ? codeString.set(n++) : codeString.clear(n++)
        }
    }
    return n
}

/**
 * 解码
 */
function decode(tree: PFCTree, code: Bitmap, n: number) {
    let x = tree.root() //根据PFC编码树
    // 将编码（二进制位图）
    for (let i = 0; i < n; i++) {
        // 转译为明码
        x = code.test(i) ? x.rc : x.lc
        if (x.isLeaf()) {
            console.log(String.fromCharCode(x.data))
            x = tree.root()
        }
    }
}

export function testPfcCode(info: string) {
    let forest = initForest()
    let tree = generateTree(forest)
    let table = generateTable(tree)

    let codeString = new Bitmap()
    let n = encode(table, codeString, info)
    decode(tree, codeString, n)
}
