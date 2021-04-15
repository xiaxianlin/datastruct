type Matrix = number[][]

export function matrixAdd(A: Matrix, B: Matrix): Matrix {
    let C: Matrix = []
    for (let r = 0; r < A.length; r++) {
        C[r] = []
        for (let c = 0; c < A[r].length; c++) {
            C[r][c] = A[r][c] + B[r][c]
        }
    }
    return C
}

export function matrixMinus(A: Matrix, B: Matrix): Matrix {
    let C: Matrix = []
    for (let r = 0; r < A.length; r++) {
        C[r] = []
        for (let c = 0; c < A[r].length; c++) {
            C[r][c] = A[r][c] - B[r][c]
        }
    }
    return C
}

export function createMatrix(row: number, column: number, data?: number[]) {
    let m: Matrix = []
    if (data && data.length !== row * column) {
        throw 'Data invalid.'
    }
    for (let i = 0; i < row; i++) {
        m[i] = []
        for (let j = 0; j < column; j++) {
            if (data) {
                m[i][j] = data[i * column + j] || 0
            } else {
                m[i][j] = 0
            }
        }
    }
    return m
}
