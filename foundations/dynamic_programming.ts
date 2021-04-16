import { createMatrix } from '../utils/matrix'

const findMinIndex = (data: number[]) => {
    let index = 0
    let poivt = data[0]
    for (let i = 1; i < data.length; i++) {
        if (data[i] < poivt) {
            poivt = data[i]
            index = i
        }
    }
    return index
}

/**
 * 二项式系数问题
 */
export function binomialTheorem() {
    function bin(n: number, k: number) {
        if (k === 0 || n === k) {
            return 1
        } else {
            return bin(n - 1, k - 1) + bin(n - 1, k)
        }
    }

    function bin2(n: number, k: number) {
        let i: number, j: number
        let B: number[][] = []
        for (i = 0; i <= n; i++) {
            B[i] = []
            for (j = 0; j <= Math.min(i, k); j++) {
                if (j === 0 || j === i) {
                    B[i][j] = 1
                } else {
                    B[i][j] = B[i - 1][j - 1] + B[i - 1][j]
                }
            }
        }
        return B[n][k]
    }
}

/**
 * 最短路径问题
 */
export function floyd() {
    let n = 5
    const createGraph = () => {
        let W: number[][] = []
        for (let i = 0; i < n; i++) {
            W[i] = []
            for (let j = 0; j < n; j++) {
                if (i === j) {
                    W[i][j] = 0
                } else {
                    W[i][j] = Infinity
                }
            }
        }

        W[0][1] = 1
        W[0][3] = 1
        W[0][4] = 5
        W[1][0] = 9
        W[1][2] = 3
        W[1][3] = 2
        W[2][3] = 4
        W[3][2] = 2
        W[3][4] = 3
        W[4][0] = 3
        return W
    }

    const initDistance = (W: number[][]) => {
        let D: number[][] = []
        for (let i = 0; i < n; i++) {
            D[i] = []
            for (let j = 0; j < n; j++) {
                D[i][j] = W[i][j]
            }
        }
        return D
    }

    const findPath1 = (W: number[][]) => {
        let D = initDistance(W)
        for (let k = 0; k < n; k++) {
            for (let i = 0; i < n; i++) {
                for (let j = 0; j < n; j++) {
                    D[i][j] = Math.min(D[i][j], D[i][k] + D[k][j])
                }
            }
        }
        return D
    }

    const findPath2 = (W: number[][], P: number[][]) => {
        let D = initDistance(W)
        for (let i = 0; i < n; i++) {
            P[i] = []
            for (let j = 0; j < n; j++) {
                P[i][j] = -1
            }
        }
        for (let k = 0; k < n; k++) {
            for (let i = 0; i < n; i++) {
                for (let j = 0; j < n; j++) {
                    if (D[i][k] + D[k][j] < D[i][j]) {
                        P[i][j] = k
                        D[i][j] = D[i][k] + D[k][j]
                    }
                }
            }
        }
        return D
    }

    const printPath = (P: number[][], q: number, r: number) => {
        if (P[q][r] !== -1) {
            printPath(P, q, P[q][r])
            console.log('v' + (P[q][r] + 1))
            printPath(P, P[q][r], r)
        }
    }

    let P: number[][] = []
    let W = createGraph()
    let D = findPath2(W, P)

    console.log(D)
    console.log(P)
    printPath(P, 2, 1)
}

/**
 * 矩阵相乘链问题
 */
export function matrixMultChain() {
    const minimum = (i: number, j: number, d: number[], M: number[][]) => {
        let values: number[] = []
        let s = d[i - 1] || 1
        for (let k = i; k < j; k++) {
            values.push(M[i][k] + M[k + 1][j] + d[i] * d[k + 1] * d[j + 1])
        }
        return { min: Math.min(...values), k: i + findMinIndex(values) }
    }
    const minmult = (n: number, d: number[], P: number[][]) => {
        let i: number, j: number, diagonal: number
        let M: number[][] = []
        for (i = 0; i < n; i++) {
            M[i] = []
            P[i] = []
            for (j = 0; j < n; j++) {
                M[i][j] = 0
                P[i][j] = 0
            }
        }
        for (diagonal = 0; diagonal < n; diagonal++) {
            for (i = 0; i < n - diagonal; i++) {
                j = i + diagonal
                if (i < j) {
                    let { min, k } = minimum(i, j, d, M)
                    M[i][j] = min
                    P[i][j] = k + 1
                }
            }
        }
        console.log(M)
        return M[0][n - 1]
    }

    const order = (i: number, j: number) => {
        if (i === j) {
            return 'A' + (i + 1)
        } else {
            let k = P[i][j] - 1
            return '(' + order(i, k) + order(k + 1, j) + ')'
        }
    }

    let n = 6
    let d = [5, 2, 3, 4, 6, 7, 8]
    let P: number[][] = []
    let count = minmult(n, d, P)
    console.log('min mult count:', count)
    console.log(P)
    console.log(order(0, n - 1))
}

/**
 * 最优二叉查找树
 */
export function binSearch() {
    class NodeType<T> {
        key: T
        left: NodeType<T> | null = null
        right: NodeType<T> | null = null
    }

    const search = <T extends unknown>(tree: NodeType<T>, keyin: T) => {
        let found: boolean
        let p = tree
        found = false
        while (!found) {
            if (p.key === keyin) {
                found = true
            } else if (keyin < p.key) {
                p = p.left
            } else {
                p = p.right
            }
        }
        return p
    }

    const minimum = (i: number, j: number, p: number[], A: number[][]) => {
        let values: number[] = []
        let total = 0
        for (let k = i; k <= j; k++) {
            total += p[k - 1]
            values.push(A[i][k - 1] + A[k + 1][j])
        }
        return { min: Math.min(...values) + total, k: i + findMinIndex(values) }
    }

    const optSearchTree = (n: number, p: number[], R: number[][]) => {
        let i: number, j: number, diagonal: number
        let A: number[][] = createMatrix(n + 2, n + 2)
        for (i = 1; i <= n; i++) {
            A[i][i] = p[i - 1]
            R[i][i] = i
        }
        for (diagonal = 1; diagonal < n; diagonal++) {
            for (i = 1; i <= n - diagonal; i++) {
                j = i + diagonal
                let { min, k } = minimum(i, j, p, A)
                A[i][j] = min
                R[i][j] = k
            }
        }
        console.log(A)
        return A[1][n - 1]
    }

    const tree = (i: number, j: number, keys: string[], R: number[][]) => {
        let k: number, p: NodeType<string>
        k = R[i][j]
        if (k === 0) {
            return null
        } else {
            p = new NodeType()
            p.key = keys[k - 1]
            p.left = tree(i, k - 1, keys, R)
            p.right = tree(k + 1, j, keys, R)
            return p
        }
    }

    let n = 4
    let keys = ['Don', 'Isabelle', 'Ralph', 'Wally']
    let p = [3 / 8, 3 / 8, 1 / 8, 1 / 8]
    let R: number[][] = createMatrix(n + 2, n + 2)
    optSearchTree(n, p, R)
    console.log(R)
    let root = tree(1, n, keys, R)
    console.log(root)
}

/**
 * 旅行推销员问题
 */
export function tour() {
    const minimum = (i: number, A: number[], W: number[][], D: Map<number, Map<string, number>>) => {
        let values: number[] = []
        for (let k = 0; k < A.length; k++) {
            let j = A[k]
            let v = A.filter((a) => a !== j)
            values.push(W[i][j - 1] + D.get(j).get(v.join('')) || 0)
        }
        let minIndex = findMinIndex(values)
        return { min: Math.min(...values), k: A[minIndex] }
    }

    const subsets = (k: number, V: number[]) => {
        let data: number[][][] = []
        for (let i = 0; i < k; i++) {
            data[i] = []
            if (i === 0) {
                data[0] = V.map((vi) => [vi])
            } else {
                // 上一轮子集作为基
                let base: number[][] = data[i - 1]
                base.forEach((b: number[], j: number) => {
                    // 将最后一个元素索引作为起始进行累加
                    for (let m = b[b.length - 1] - 1; m < V.length; m++) {
                    // for (let m = b.length + j; m < V.length; m++) {
                        data[i].push(b.concat(V[m]))
                    }
                })
            }
        }
        return data
    }

    const travel = (n: number, V: number[], W: number[][], P: Map<number, Map<string, number>>) => {
        let i: number, j: number, k: number, s: number
        let D: Map<number, Map<string, number>> = new Map()
        // 初始i->1的路线长度
        for (i = 0; i < n; i++) {
            D.set(i + 1, new Map())
            P.set(i + 1, new Map())
            if (i > 0) {
                D.get(i + 1).set('', W[i][0])
            }
        }

        let subsetData = subsets(n - 2, V.slice(1))

        //  中间路径个数
        for (k = 1; k <= n - 2; k++) {
            // 获取长度为k的子集
            let As = subsetData[k - 1]
            // 从vi开始出发
            for (i = 1; i < n; i++) {
                for (s = 0; s < As.length; s++) {
                    let A = As[s]
                    if (!A.includes(i + 1)) {
                        let { min, k } = minimum(i, A, W, D)
                        let path = A.join('')
                        D.get(i + 1).set(path, min)
                        P.get(i + 1).set(path, k)
                    }
                }
            }
        }
        let A = V.slice(1)
        let { min, k: m } = minimum(0, A, W, D)
        D.get(1).set(A.join(''), min)
        P.get(1).set(A.join(''), m)
        // console.log(D)
        return min
    }

    const drawPath = (index: number, V: number[], P: Map<number, Map<string, number>>, paths: number[]) => {
        if (!V.length) return
        let vi = P.get(index).get(V.join(''))
        paths.push(vi)
        drawPath(
            vi,
            V.filter((i) => i !== vi),
            P,
            paths
        )
    }

    let n = 5
    let V = [1, 2, 3, 4, 5]
    let W = [
        [0, 2, 9, Infinity, 2],
        [1, 0, 6, 4, Infinity],
        [Infinity, 7, 0, 8, Infinity],
        [6, 3, Infinity, 0, Infinity],
        [Infinity, 3, Infinity, 9, 0]
    ]
    let P: Map<number, Map<string, number>> = new Map()
    let paths = []

    console.log(W)
    let len = travel(n, V, W, P)
    // console.log(P)
    drawPath(1, V.slice(1), P, paths)
    console.log('v1->' + paths.map((p) => 'v' + p).join('->') + '->v1：', len)

    // console.log(subsets(n - 2, V.slice(1)))
}
// 