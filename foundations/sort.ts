namespace Sort {
    function swap(S: number[], i: number, j: number) {
        let t = S[i]
        S[i] = S[j]
        S[j] = t
    }
    export function insertion(S: number[]) {
        let i: number, j: number, x: number
        for (i = 1; i < S.length; i++) {
            x = S[i]
            j = i - 1
            while (j >= 0 && S[j] > x) {
                S[j + 1] = S[j]
                j--
            }
            S[j + 1] = x
        }
    }

    export function selection(S: number[]) {
        let i: number, j: number, smallest: number
        for (i = 0; i < S.length - 1; i++) {
            smallest = i
            for (j = i + 1; j < S.length; j++) {
                if (S[j] < S[smallest]) smallest = j
            }
            swap(S, i, smallest)
        }
    }

    function partition(S: number[], low: number, high: number) {
        let i: number, j: number, pivotitem: number
        pivotitem = S[low]
        j = low
        for (i = low + 1; i <= high; i++) {
            if (S[i] < pivotitem) {
                j++
                swap(S, i, j)
            }
        }
        swap(S, low, j)
        return j
    }

    export function quick(S: number[]) {
        const exec = (S: number[], low: number, high: number) => {
            if (high <= low) return
            let pivotpoint = partition(S, low, high)
            exec(S, low, pivotpoint - 1)
            exec(S, pivotpoint + 1, high)
        }
        exec(S, 0, S.length - 1)
    }

    function mergeAction(U: number[], V: number[], S: number[]) {
        let i: number = 0,
            j: number = 0,
            k: number = 0,
            n: number = 0,
            h: number = U.length,
            m: number = V.length

        while (i < h && j < m) {
            if (U[i] < V[j]) {
                S[k] = U[i]
                i++
            } else {
                S[k] = V[j]
                j++
            }
            k++
        }
        if (i >= h) {
            for (n = j; n < m; n++) S[k++] = V[n]
        } else {
            for (n = i; n < h; n++) S[k++] = U[n]
        }
    }

    export function merge(S: number[]) {
        if (S.length < 2) return
        let h = S.length >> 1,
            m = S.length - h,
            U = [],
            V = []
        for (let i = 0; i < h; i++) U[i] = S[i]
        for (let i = 0; i < m; i++) V[i] = S[h + i]
        merge(U)
        merge(V)
        mergeAction(U, V, S)
    }

    function mergeAction2(S: number[], low: number, mid: number, high: number) {
        let i: number, j: number, k: number, n: number
        let U = []
        i = low
        j = mid + 1
        k = low
        while (i <= mid && j <= high) {
            if (S[i] < S[j]) {
                U[k] = S[i]
                i++
            } else {
                U[k] = S[j]
                j++
            }
            k++
        }
        if (i > mid) {
            for (n = j; n <= high; n++) U[k++] = S[n]
        } else {
            for (n = i; n <= mid; n++) U[k++] = S[n]
        }
        for (n = low; n <= high; n++) S[n] = U[n]
    }

    export function merge2(S: number[]) {
        const exec = (S: number[], low: number, high: number) => {
            if (low >= high) return
            let mid = Math.floor((low + high) / 2)
            exec(S, low, mid)
            exec(S, mid + 1, high)
            mergeAction2(S, low, mid, high)
        }
        exec(S, 0, S.length - 1)
    }

    interface Heap {
        S: number[]
        size: number
    }
    function siftdown(H: Heap, i: number) {
        let largerchild = -1
        let siftkey = H.S[i]
        let parent = i
        let spotfound = false
        while (2 * parent <= H.size && !spotfound) {
            // 找出子节点中最大值
            if (2 * parent < H.size && H.S[2 * parent] < H.S[2 * parent + 1]) {
                largerchild = 2 * parent + 1
            } else {
                largerchild = 2 * parent
            }
            // 如果父节点数据小于子节点，交互父子节点数据，然后继续向下检查，否则结束
            if (siftkey < H.S[largerchild]) {
                H.S[parent] = H.S[largerchild]
                parent = largerchild
            } else {
                spotfound = true
            }
        }
        H.S[parent] = siftkey
    }
    function root(H: Heap) {
        let keyout = H.S[0] // 获取位于根节点的值
        H.S[0] = H.S[H.size - 1] // 将底部值移至根节点处
        H.size = H.size - 1 // 删除底部节点
        siftdown(H, 0) // 恢复堆性质
        return keyout
    }
    function removekeys(H: Heap) {
        for (let i = H.S.length - 1; i >= 0; i--) H.S[i] = root(H)
    }
    function makeheap(H: Heap) {
        for (let i = Math.floor(H.size / 2); i >= 0; i--) siftdown(H, i)
    }
    export function heap(S: number[]) {
        let H: Heap = { S, size: S.length }
        makeheap(H)
        console.log('heap', H.S)
        removekeys(H)
    }

    interface RadixNode {
        key: number
        link: RadixNode
    }

    function append(list: RadixNode, p: RadixNode) {
        let node = list
        while (node.link) node = node.link
        node.link = p
    }

    function getIndex(key: number, i: number) {
        if (i === 1) {
            return key % 10
        } else {
            return Math.floor(key / Math.pow(10, i - 1))
        }
    }

    function distribute(list: RadixNode[], root: RadixNode, i: number) {
        let p = root.link
        for (let j = 0; j < 10; j++) list[j] = null
        while (p) {
            let j = getIndex(p.key, i)
            let radixlist = list[j]
            console.log(j, radixlist)
            if (radixlist) {
                append(radixlist, { key: p.key, link: null })
            } else {
                list[j] = { key: p.key, link: null }
            }
            p = p.link
        }
    }

    function coalesce(list: RadixNode[], root: RadixNode) {
        root.link = list[0]
        let parent = root.link
        for (let i = 1; i < 10; i++) {
            parent.link = list[i]
            parent = list[i]
        }
    }

    export function radix(S: number[]) {
        let list: RadixNode[] = []
        let root: RadixNode = { key: null, link: null }
        // 构建主链
        let parent = root.link
        for (let i = 0; i < S.length; i++) {
            let node = { key: S[i], link: null }
            parent.link = node
            parent = node
        }

        for (let i = 2; i >= 2; i--) {
            distribute(list, root, i)
            coalesce(list, root)
        }
        console.log(root)
        // let node = root.link
        // let i = 0
        // while (node) {
        //     S[i] = node.key
        //     node = node.link
        // }
    }
}

export default Sort
