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
