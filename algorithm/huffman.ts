import * as fs from 'fs'
import * as path from 'path'
import { arrayFill } from '../common/util'
import BinTree, { BinNode } from '../struct/binary_tree'
import Bitmap from '../struct/bitmap'
import HashTable from '../struct/hashtable'
import List, { ListNode } from '../struct/list'

class HuffChar {
    ch: number
    weight: number
    // c默认字符为'^'
    constructor(c: number = 94, w: number = 0) {
        this.ch = c
        this.weight = w
    }

    valueOf() {
        return this.weight
    }
}

type HuffTree = BinTree<HuffChar>
type HuffForest = List<HuffTree>
type HuffCode = Bitmap
type HuffTable = HashTable<number, string>

const N_CHAR = 0x80 - 0x20

const file = path.resolve('./assets/news.txt')

/**
 * 统计字符出现频率
 */
function statistics(smaple_text_file: string): number[] {
    let freq = arrayFill(N_CHAR, 0) // 创建字符出现次数的记录数组
    let buffer = fs.readFileSync(smaple_text_file)
    // 逐个扫描样本文件中的每个字符
    buffer.forEach((ch) => {
        // 累计对应的出现次数
        if (ch >= 0x20) freq[ch - 0x20]++
    })
    return freq
}

/**
 * 根据频率统计表，为每个字符创建一棵树
 */
function initForest(freg: number[]): HuffForest {
    let forest: HuffForest = new List<HuffTree>() // 以List实现的Huffman森林
    // 为每个字符
    for (let i = 0; i < N_CHAR; i++) {
        // 生成一棵树，并将字符及其频率
        forest.insertAsLast(new BinTree<HuffChar>())
        // 存入其中
        forest.last().data.insertAsRoot(new HuffChar(0x20 + i, freg[i]))
    }
    return forest
}

/**
 * 在Huffman森林中找出权重最小的（超）字符
 */
function minHChar(forest: HuffForest): HuffTree {
    let p = forest.first() // 从首节点出发
    let minChar = p // 最小Huffman的位置
    let minWeight = p.data.root().data.weight // 目前的最小权重
    // 遍历所有节点
    while (forest.valid((p = p.succ))) {
        // 若当前节点所含树最小，则
        if (minWeight > p.data.root().data.weight) {
            // 更新记录
            minWeight = p.data.root().data.weight
            minChar = p
        }
    }
    // 将挑选出来的Huffman树从森林中摘除并返回
    return forest.remove(minChar)
}

/**
 * Huffman编码算法
 */
function generateTree(forest: HuffForest): HuffTree {
    while (1 < forest.size()) {
        let T1 = minHChar(forest)
        let T2 = minHChar(forest)
        let S = new BinTree<HuffChar>()
        S.insertAsRoot(new HuffChar(94, T1.root().data.weight + T2.root().data.weight))
        S.attachAsLC(S.root(), T1)
        S.attachAsRC(S.root(), T2)
        forest.insertAsLast(S)
    }
    return forest.first().data
}

/**
 * 通过遍历获取各字符的编码
 */
function generateCT(code: HuffCode, length: number, table: HuffTable, v: BinNode<HuffChar>) {
    // 若是叶节点
    if (v.isLeaf()) {
        table.put(v.data.ch, code.bits2string(length))
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
 * 将各字符编码统一存入以散列表实现的编码中
 */
function generateTable(tree: HuffTree): HuffTable {
    let table = new HashTable<number, string>()
    let code = new Bitmap()
    generateCT(code, 0, table, tree.root())
    return table
}

/**
 * 编码
 */
function encode(table: HuffTable, codeString: HuffCode, s: string): number {
    let n = 0
    // 对于明文s[]中的每个字符
    for (let m = s.length, i = 0; i < m; i++) {
        let key = s[i].charCodeAt(0)
        // 取出其对应的编码串
        let pCharCode = table.get(key)
        // 小写字母转为大写
        if (!pCharCode) pCharCode = table.get(key - 32)
        // 无法识别的字符统一视作空格
        if (!pCharCode) pCharCode = table.get(' '.charCodeAt(0))
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
function decode(tree: HuffTree, code: HuffCode, n: number) {
    let x = tree.root() //根据PFC编码树
    // 将编码（二进制位图）
    for (let i = 0; i < n; i++) {
        // 转译为明码
        x = code.test(i) ? x.rc : x.lc
        if (x.isLeaf()) {
            console.log(String.fromCharCode(x.data.ch))
            x = tree.root()
        }
    }
}

export function testHuffmanCode(info: string) {
    let freq = statistics(file)
    let forest = initForest(freq)
    let tree = generateTree(forest)
    let table = generateTable(tree)
    let codeStirng = new Bitmap()
    let n = encode(table, codeStirng, info)
    decode(tree, codeStirng, n)
}
