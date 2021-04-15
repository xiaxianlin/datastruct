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

export function matrixMultChain() {
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

    const minimum = (i: number, j: number, d: number[], M: number[][]) => {
        let values: number[] = []
        let s = d[i - 1] || 1
        for (let k = i; k < j; k++) {
            values.push(M[i][k] + M[k + 1][j] + d[i] * d[k + 1] * d[j + 1])
        }
        return { min: Math.min(...values), k: i + findMinIndex(values) }
    }

    const minmult = (n: number, d: number[], P: number[][]) => {
        let i: number, j: number, k: number, diagonal: number
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
