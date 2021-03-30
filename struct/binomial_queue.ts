import { BADQUERY } from 'dns'
import { BinNode } from './binary_tree'

const MINIMAL = 10000

class BinomialQueue<T> {
    size: number
    trees: BinNode<T>[]

    protected getLastChild(root: BinNode<T>) {
        while (root.rc) root = root.rc
        return root
    }

    protected getHeight(root: BinNode<T>) {
        let height: number
        if (root === null) {
            return 0
        }
        height = 1
        while (root.rc) {
            height++
            root = root.rc
        }
        return height
    }

    constructor(size: number = 1) {
        this.size = size
        for (let i = 0; i < size; i++) {
            this.trees[i] = null
        }
    }

    minimal() {
        let size: number, i: number, minimal: unknown, miniIndex: number
        minimal = MINIMAL
        size = this.size
        for (i = 0; i < size; i++) {
            if (this.trees[i] && this.trees[i].data < minimal) {
                minimal = this.trees[i].data
                miniIndex = i
            }
        }
        return miniIndex
    }

    innerMerge(h1: BinNode<T>, height: number, h2: BinNode<T>) {
        if (h1.lc === null) {
            h1.lc = h2
        } else {
            this.getLastChild(h1.lc).rc = h2
        }
        height++
        this.trees[height - 1] = null
        this.merge(h1, height)
        return h1
    }

    outerMerge(bq2: BinomialQueue<T>) {
        let bq1 = this
        let i: number, height: number
        for (i = 0; bq2.size; i++) {
            height = -1
            if (bq2.trees[i]) {
                height = this.getHeight(bq2.trees[i].lc)
                this.merge(bq2.trees[i], height)
            }
        }
    }

    merge(h1: BinNode<T>, height: number) {
        if (h1 === null) {
            return h1
        }
        if (this.trees[height] === null) {
            this.trees[height] = h1
            return this.trees[height]
        } else {
            if (h1.data > this.trees[height].data) {
                this.innerMerge(this.trees[height], height, h1)
            } else {
                this.innerMerge(h1, height, this.trees[height])
            }
        }
    }

    insert(e: T) {
        this.merge(new BinNode(e), 0)
    }

    deleteMin() {
        let i = this.minimal()
        let miniTree = this.trees[i].lc
        this.trees[i] = null
        while (miniTree) {
            let rc = miniTree.rc
            miniTree.rc = null
            this.merge(miniTree, this.getHeight(miniTree.lc))
            miniTree = rc
        }
    }
}

export default BinomialQueue
