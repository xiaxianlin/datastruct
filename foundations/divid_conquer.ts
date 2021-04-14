import { matrixAdd, matrixMinus } from '../utils/matrix'

const threshold = 2
type Matrix = number[][]

export function halfCutMatrix(M: Matrix) {
    let n = M.length / 2
    let m00: Matrix = [],
        m01: Matrix = [],
        m10: Matrix = [],
        m11: Matrix = []
    // Row
    for (let i = 0; i < n; i++) {
        m00[i] = []
        m01[i] = []
        m10[i] = []
        m11[i] = []
        // Column
        for (let j = 0; j < n; j++) {
            m00[i][j] = M[i][j]
            m01[i][j] = M[i][j + n]
            m10[i][j] = M[i + n][j]
            m11[i][j] = M[i + n][j + n]
        }
    }
    return [m00, m01, m10, m11]
}

export function Matrix2Mult(a: Matrix, b: Matrix): Matrix {
    let m1 = (a[0][0] + a[1][1]) * (b[0][0] + b[1][1])
    let m2 = (a[1][0] + a[1][1]) * b[0][0]
    let m3 = a[0][0] * (b[0][1] - b[1][1])
    let m4 = a[1][1] * (b[1][0] - b[0][0])
    let m5 = (a[0][0] + a[0][1]) * b[1][1]
    let m6 = (a[1][0] - a[0][0]) * (b[0][0] + b[0][1])
    let m7 = (a[0][1] - a[1][1]) * (b[1][0] + b[1][1])
    return [
        [m1 + m4 - m5 + m7, m3 + m5],
        [m2 + m4, m1 + m3 - m2 + m6]
    ]
}

export function strassen(A: Matrix, B: Matrix) {
    if (Math.log2(A.length) % 2 !== 0) {
        throw 'Matrix invalid.'
    }
    if (A.length <= threshold) {
        return Matrix2Mult(A, B)
    } else {
        let [A00, A01, A10, A11] = halfCutMatrix(A)
        let [B00, B01, B10, B11] = halfCutMatrix(B)
        let m1 = strassen(matrixAdd(A00, A11), matrixAdd(B00, B11))
        let m2 = strassen(matrixAdd(A10, A11), B00)
        let m3 = strassen(A00, matrixMinus(B01, B11))
        let m4 = strassen(A11, matrixMinus(B10, B00))
        let m5 = strassen(matrixAdd(A00, A01), B11)
        let m6 = strassen(matrixMinus(A10, A00), matrixAdd(B00, B01))
        let m7 = strassen(matrixMinus(A01, A11), matrixAdd(B10, B11))
        let C00 = matrixMinus(matrixAdd(m1, m4), matrixAdd(m5, m7))
        let C01 = matrixAdd(m3, m5)
        let C10 = matrixAdd(m2, m4)
        let C11 = matrixMinus(matrixAdd(m1, m3), matrixAdd(m2, m6))

        let C: Matrix = []
        let m = A.length / 2
        for (let i = 0; i < A.length; i++) {
            C[i] = []
            for (let j = 0; j < A.length; j++) {
                let value: number
                if (i < m && j < m) {
                    value = C00[i][j]
                } else if (i < m && j >= m) {
                    value = C01[i][j - m]
                } else if (i >= m && j < m) {
                    value = C10[i - m][j]
                } else if (i >= m && j >= m) {
                    value = C11[i - m][j - m]
                }
                C[i][j] = value
            }
        }
        return C
    }
}
