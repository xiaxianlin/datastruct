import * as fs from 'fs'
import * as path from 'path'
import List from './struct/list'
import { insertionSort, selectionSort } from './algorithm/sort'
import { convert, evaluate, labyrinth, paren, placeQueens } from './algorithm/stack'
import { fib } from './algorithm/other'
import { displayLaby, randLaby } from './utils/laby'
import BinTree from './struct/binary_tree'
import GraphMatrix from './struct/graph_matrix'
import BST from './struct/bst'
import AVL from './struct/avl'
import Splay from './struct/splay'
import Vector from './struct/vector'
import BTree from './struct/btree'
import RedBlackTree from './struct/red_black_tree'
import SkipList from './struct/skip_list'
import { fibSearch } from './algorithm/search'
import Bitmap from './struct/bitmap'
import { primeNLT, rand } from './common/util'
import HashTable from './struct/hashtable'
import { testPfcCode } from './algorithm/pfc'
import { testHuffmanCode } from './algorithm/huffman'

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

function testGraphBFS() {
    let graph = new GraphMatrix<string, any>()
    let va = graph.insertVertex('A')
    let vb = graph.insertVertex('B')
    let vc = graph.insertVertex('C')
    let vd = graph.insertVertex('D')
    let ve = graph.insertVertex('E')
    let vf = graph.insertVertex('F')
    let vg = graph.insertVertex('G')
    let vs = graph.insertVertex('S')

    graph.insertEdge(101, vs, va, 0) // s->a
    graph.insertEdge(103, vs, vd, 0) // s->d
    graph.insertEdge(106, vd, vb, 0) // d->b
    graph.insertEdge(102, vs, vc, 0) // s->c
    graph.insertEdge(104, va, ve, 0) // a->e
    graph.insertEdge(105, va, vc, 0) // a->c
    graph.insertEdge(107, vc, vb, 0) // c->b
    graph.insertEdge(108, ve, vf, 0) // e->f
    graph.insertEdge(109, ve, vg, 0) // e->g
    graph.insertEdge(110, vg, vf, 0) // g->f
    graph.insertEdge(111, vg, vb, 0) // g->b

    graph.bfs(vs)
}

function testGraphDFS() {
    let graph = new GraphMatrix<string, any>()
    let va = graph.insertVertex('A')
    let vb = graph.insertVertex('B')
    let vc = graph.insertVertex('C')
    let vd = graph.insertVertex('D')
    let ve = graph.insertVertex('E')
    let vf = graph.insertVertex('F')
    let vg = graph.insertVertex('G')

    graph.insertEdge(101, va, vb, 0) // a->b
    graph.insertEdge(103, va, vf, 0) // a->f
    graph.insertEdge(106, va, vc, 0) // a->c
    graph.insertEdge(102, vb, vc, 0) // b->c
    graph.insertEdge(104, vg, vc, 0) // g->c
    graph.insertEdge(105, vg, va, 0) // g->a
    graph.insertEdge(107, vd, va, 0) // d->a
    graph.insertEdge(108, vd, ve, 0) // d->e
    graph.insertEdge(109, ve, vf, 0) // e->f
    graph.insertEdge(110, vf, vg, 0) // f->g

    graph.dfs(vd)
}

function testGraphTSort() {
    let graph = new GraphMatrix<string, any>()
    let va = graph.insertVertex('A')
    let vb = graph.insertVertex('B')
    let vc = graph.insertVertex('C')
    let vd = graph.insertVertex('D')
    let ve = graph.insertVertex('E')
    let vf = graph.insertVertex('F')

    graph.insertEdge(101, va, vc, 0) // a->c
    graph.insertEdge(102, va, vd, 0) // a->d
    graph.insertEdge(103, vb, vc, 0) // b->c
    graph.insertEdge(104, vc, vd, 0) // c->d
    graph.insertEdge(105, vc, vf, 0) // c->f
    graph.insertEdge(106, vc, ve, 0) // c->e
    graph.insertEdge(107, ve, vf, 0) // e->f

    graph.tSort(vb)
}

function testGraphBCC() {
    let graph = new GraphMatrix<string, any>()
    let va = graph.insertVertex('A')
    let vb = graph.insertVertex('B')
    let vc = graph.insertVertex('C')
    let vd = graph.insertVertex('D')
    let ve = graph.insertVertex('E')
    let vf = graph.insertVertex('F')
    let vg = graph.insertVertex('G')
    let vh = graph.insertVertex('H')
    let vi = graph.insertVertex('I')
    let vj = graph.insertVertex('J')

    // ab
    graph.insertEdge(101, va, vb, 0)
    graph.insertEdge(101, vb, va, 0)
    // ah
    graph.insertEdge(102, va, vh, 0)
    graph.insertEdge(102, vh, va, 0)
    // ai
    graph.insertEdge(103, va, vi, 0)
    graph.insertEdge(103, vi, va, 0)
    // aj
    graph.insertEdge(104, va, vj, 0)
    graph.insertEdge(104, vj, va, 0)
    // bc
    graph.insertEdge(105, vb, vc, 0)
    graph.insertEdge(105, vc, vb, 0)
    // cd
    graph.insertEdge(106, vc, vd, 0)
    graph.insertEdge(106, vd, vc, 0)
    // ch
    graph.insertEdge(107, vc, vh, 0)
    graph.insertEdge(107, vh, vc, 0)
    // de
    graph.insertEdge(108, vd, ve, 0)
    graph.insertEdge(108, ve, vd, 0)
    // dg
    graph.insertEdge(109, vd, vg, 0)
    graph.insertEdge(109, vg, vd, 0)
    // eg
    graph.insertEdge(110, ve, vg, 0)
    graph.insertEdge(110, vg, ve, 0)
    // fg
    graph.insertEdge(111, vf, vg, 0)
    graph.insertEdge(111, vg, vf, 0)
    // ij
    graph.insertEdge(111, vi, vj, 0)
    graph.insertEdge(111, vj, vi, 0)

    graph.bcc(vb)
}

function testGraphPrim() {
    let graph = new GraphMatrix<string, any>()
    let va = graph.insertVertex('A')
    let vb = graph.insertVertex('B')
    let vc = graph.insertVertex('C')
    let vd = graph.insertVertex('D')
    let ve = graph.insertVertex('E')
    let vf = graph.insertVertex('F')
    let vg = graph.insertVertex('G')
    let vh = graph.insertVertex('H')

    // ad
    graph.insertEdge(null, va, vd, 6)
    graph.insertEdge(null, vd, va, 6)
    // ag
    graph.insertEdge(null, va, vg, 7)
    graph.insertEdge(null, vg, va, 7)
    // ab
    graph.insertEdge(null, va, vb, 4)
    graph.insertEdge(null, vb, va, 4)
    // bc
    graph.insertEdge(null, vb, vc, 12)
    graph.insertEdge(null, vc, vb, 12)
    // dg
    graph.insertEdge(null, vd, vg, 2)
    graph.insertEdge(null, vg, vd, 2)
    // de
    graph.insertEdge(null, vd, ve, 13)
    graph.insertEdge(null, ve, vd, 13)
    // dc
    graph.insertEdge(null, vd, vc, 9)
    graph.insertEdge(null, vc, vd, 9)
    // eg
    graph.insertEdge(null, ve, vg, 11)
    graph.insertEdge(null, vg, ve, 11)
    // ec
    graph.insertEdge(null, ve, vc, 1)
    graph.insertEdge(null, vc, ve, 1)
    // ef
    graph.insertEdge(null, ve, vf, 5)
    graph.insertEdge(null, vf, ve, 5)
    // eh
    graph.insertEdge(null, ve, vh, 8)
    graph.insertEdge(null, vh, ve, 8)
    // gh
    graph.insertEdge(null, vg, vh, 14)
    graph.insertEdge(null, vh, vg, 14)
    // cf
    graph.insertEdge(null, vc, vf, 2)
    graph.insertEdge(null, vf, vc, 2)
    // ch
    graph.insertEdge(null, vc, vh, 10)
    graph.insertEdge(null, vh, vc, 10)
    // fh
    graph.insertEdge(null, vf, vh, 7)
    graph.insertEdge(null, vh, vf, 7)

    graph.prim(va)
}

function testGraphDijkstra() {
    let graph = new GraphMatrix<string, any>()
    let vs = graph.insertVertex('S')
    let va = graph.insertVertex('A')
    let vb = graph.insertVertex('B')
    let vc = graph.insertVertex('C')
    let vd = graph.insertVertex('D')
    let ve = graph.insertVertex('E')
    let vf = graph.insertVertex('F')
    let vg = graph.insertVertex('G')

    graph.insertEdge(null, vs, va, 9)
    graph.insertEdge(null, vs, vc, 14)
    graph.insertEdge(null, vs, vf, 15)

    graph.insertEdge(null, va, vb, 25)
    graph.insertEdge(null, vc, vb, 18)
    graph.insertEdge(null, vc, vd, 30)
    graph.insertEdge(null, vc, vf, 5)
    graph.insertEdge(null, vf, vd, 20)
    graph.insertEdge(null, vf, vg, 40)

    graph.insertEdge(null, vb, vd, 2)
    graph.insertEdge(null, vd, ve, 11)
    graph.insertEdge(null, vd, vg, 16)
    graph.insertEdge(null, ve, vb, 6)
    graph.insertEdge(null, ve, vg, 6)

    graph.dijkstra(vs)
}

function testBST() {
    let tree = new BST<number>()
    tree.insert(36)
    tree.insert(27)
    tree.insert(6)
    tree.insert(58)
    tree.insert(53)
    tree.insert(69)
    tree.insert(46)
    tree.insert(40)

    console.log('-----BST-----')
    tree.print()
}

function testAVL() {
    let tree = new AVL<number>()
    tree.insert(36)
    tree.insert(27)
    tree.insert(6)
    tree.insert(58)
    tree.insert(53)
    tree.insert(69)
    tree.insert(46)
    tree.insert(40)

    console.log('-----AVL-----')
    tree.print()
}

function testSplay() {
    let tree = new Splay<number>()
    tree.insert(36)
    tree.insert(27)
    tree.insert(6)
    tree.insert(58)
    tree.insert(53)
    tree.insert(69)
    tree.insert(46)
    tree.insert(40)

    console.log('-----SPLAY-----')
    tree.print()
}

function testBTree() {
    let tree = new BTree<number>()
    tree.insert(19)
    tree.insert(36)
    tree.insert(41)
    tree.insert(51)
    tree.insert(53)
    tree.insert(75)
    tree.insert(77)
    tree.insert(79)
    tree.insert(84)
    tree.insert(89)
    tree.insert(97)

    // console.log(tree.root())
    // tree.root().child.traverse((e) => {
    //     console.log(e)
    // })

    tree.remove(36)
    // console.log(tree.root())
    // tree.root().child.traverse((e) => {
    //     console.log(e)
    // })
}

function testRedBlackTree() {
    let tree = new RedBlackTree<number>()
    tree.insert(36)
    tree.insert(27)
    tree.insert(6)
    tree.insert(58)
    tree.insert(53)
    tree.insert(69)
    tree.insert(46)
    tree.insert(40)

    tree.remove(53)

    console.log('-----REDBLACK-----')
    tree.print()
}

function testSkipList() {
    let list = new SkipList<number, string>()
    list.put(1, 'one')
    list.put(12, 'tweleve')

    console.log(list.get(12))

    list.remove(12)

    console.log(list.get(12))
}

function testBitmap() {
    let file = path.resolve('./assets/prime-1048576-bitmap.txt')
    let c = primeNLT(0, 2000, file)
    console.log(c)
}

function testHashtable() {
    let ht = new HashTable<number, string>()
    ht.put(123, 'abc')
    console.log(ht.get(123))
    ht.remove(123)
    console.log(ht.get(123))
}

// testBST()
// testAVL()
// testSplay()
// testRedBlackTree()

// testSkipList()

// testPfcCode('message')

testHuffmanCode('message')
