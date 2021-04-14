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
