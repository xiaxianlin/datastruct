import List from './struct/list'
import { insertionSort, selectionSort } from './algorithm/sort'
import { convert, evaluate, labyrinth, paren, placeQueens } from './algorithm/stack'
import { displayLaby, randLaby } from './utils/laby'
import BinTree from './struct/binary_tree'
import Bitmap from './common/bitmap'

const data = [1, 7, 3, 8, 5, 6, 55, 20]

function testListSort() {
    let list = new List<number>(data)
    list.sort()
    list.traverse((item: number) => {
        console.log('list', item)
    })
}

function testInsertionSort() {
    insertionSort(data)
    console.log(data)
}

function testSelectionSort() {
    selectionSort(data)
    console.log(data)
}

function testConvert() {
    console.log(convert(12345, 16))
}

function testParen() {
    let exp = 'a/(b[i-1][j+1]+c[i+1][j-1])*2'

    console.log(exp, paren(exp, 0, exp.length))
}

function testEvaluate(S: string) {
    let RPN = []
    let res = evaluate(S, RPN)
    console.log(S)
    console.log('result:', res)
    console.log('RPN:', RPN.join(' '))
}

function testPlaceQueens() {
    let queens = placeQueens(8)
    queens.print()
}

function testRandLaby() {
    let [laby, start, goal] = randLaby(24)
    labyrinth(laby, start, goal)
    displayLaby(laby, start, goal)
}

function testBinTreeTraversal() {
    let tree = new BinTree<number>()
    let root = tree.insertAsRoot(1)
    // 第一层
    let n12 = tree.insertAsLC(root, 2)
    let n13 = tree.insertAsRC(root, 3)
    // 第二层
    let n124 = tree.insertAsLC(n12, 4)
    let n125 = tree.insertAsRC(n12, 5)
    let n136 = tree.insertAsLC(n13, 6)
    let n137 = tree.insertAsRC(n13, 7)
    // 第三层
    let n1248 = tree.insertAsLC(n124, 8)
    let n1249 = tree.insertAsRC(n124, 9)
    // 第四层
    let n124910 = tree.insertAsLC(n1249, 10)
    let n124911 = tree.insertAsRC(n1249, 11)

    // tree.travPre((e) => {})
    // tree.travIn((e) => {})
    // tree.travPost((e) => {})
    // tree.travLevel((e) => {})
    console.log('isCompleteBinTree', tree.isCompleteBinTree())
    console.log('isFullBinTree', tree.isFullBinTree())
}

// testBinTreeTraversal()
