import { rand } from '../common/util'

/**
 * 无序数组去重
 * @param A 数组
 */
export function deduplicate<T>(A: T[]) {
    // 前序区间列表查找
    let find = (A: T[], e: T, n: number) => {
        while (-1 < n--) if (e === A[n]) return n
        return -1
    }
    let r = 0
    while (r !== A.length) find(A, A[r], r) !== -1 ? A.splice(r, 1) : r++
}

/**
 * 有序数组去重
 * @param A 数组
 */
export function uniquify<T>(A: T[]) {
    let r = 0
    while (r !== A.length) A[r] === A[r + 1] ? A.splice(r, 1) : r++
}

export function fib(n: number) {
    let p = 0
    let c = 1
    if (n < 2) {
        return c
    }
    while (n > 1) {
        let t = c
        c = c + p
        p = t
        n--
    }
    return c
}

const A = 48271
const M = 2147483647
const Q = Math.floor(M / A)
const R = M % A

let seed = 1

function culcRandom() {
    let tmpSeed = A * (seed % Q) - R * Math.floor(seed / Q)
    if (tmpSeed >= 0) {
        seed = tmpSeed
    } else {
        seed = tmpSeed + M
    }
    return seed / M
}

export function random(init: any) {
    return
}

function witness(A: number, i: number, N: number) {
    let X: number, Y: number
    if (i === 0) return 1

    X = witness(A, i / 2, N)
    if (X === 0) return 0

    Y = (X * X) % N
    if (Y === 1 && X !== 1 && X != N - 1) return 0

    if (i % 2 !== 0) {
        Y = (A * Y) % N
    }

    return Y
}

export function isPrime(N: number) {
    return witness(rand(2, N - 2), N - 1, N) === 1
}
