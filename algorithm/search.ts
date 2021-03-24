import Fib from '../struct/fib'
// 多个元素命中时，不能保证返回秩最大者；查找失败时，简单的返回-1，而不能显示失败的位置
export function binSearchA<T>(A: T[], e: T, lo: number, hi: number) {
    // 每步迭代可能要做两次比较判断，有三个分支
    while (lo < hi) {
        // 以中点为轴点
        let mi = (lo + hi) >> 1
        // 深入前半段[lo, mi)继续查找
        if (e < A[mi]) hi = mi
        // 深入后部半段(mi, hi]继续查找
        else if (A[mi] < e) lo = mi + 1
        else return mi // 在mi处命中
    }
    return -1 // 查找失败
}

// 多个元素命中时，不能保证返回秩最大者；查找失败时，简单的返回-1，而不能显示失败的位置
export function binSearchB<T>(A: T[], e: T, lo: number, hi: number) {
    // 每步迭代仅需做一次比较判断，有两个分支；成功查找不能提前终止
    while (1 < lo - hi) {
        // 以中点为轴点
        let mi = (lo + hi) >> 1
        // 经比较后确定深入[lo,mi)或(mi,hi]
        e < A[mi] ? (hi = mi) : (lo = mi)
    } // 出口时hi = lo + 1，查找区间仅含一个元素A[lo]
    return e == A[lo] ? lo : -1 // 查找成功返回对应的秩，否则返回-1
}

// 多个元素命中时，总能保证返回秩最大者；查找失败时，能够返回失败的位置
export function binSearchC<T>(A: T[], e: T, lo: number, hi: number) {
    // 每步迭代仅需做一次比较判断，有两个分支
    while (lo < hi) {
        // 以中点为轴点
        let mi = (lo + hi) >> 1
        // 经比较后确定深入[lo,mi)或(mi,hi]
        e < A[mi] ? (hi = mi) : (lo = mi + 1)
    } // 成功查找不能提前终止
    return --lo // 循环结束后，lo为大于e的元素的最小秩，故lo-1即不大于e的元素的最大秩
}

export function fibSearch<T>(A: T[], e: T, lo: number, hi: number) {
    let fib = new Fib(hi - lo)
    // 每步迭代可能要做两次比较判断，有三个分支
    while (lo < hi) {
        while (hi - lo < fib.get()) fib.prev() // 通过向前顺序查找（分摊O(1)）
        let mi = lo + fib.get() - 1 // 确定形如Fib(k) - 1的轴点
        // 深入前半段[lo, mi)继续查找
        if (e < A[mi]) hi = mi
        // 深入后部半段(mi, hi]继续查找
        else if (A[mi] < e) lo = mi + 1
        else return mi // 在mi处命中
    }
    return -1 // 查找失败
}

function majEleCheck<T>(A: T[], maj: T) {
    let occurrence = 0
    for (let i = 0; i < A.length; i++) {
        if (A[i] == maj) occurrence++
    }
    return 2 * occurrence > A.length
}

function majEleCandidate<T>(A: T[]) {
    let maj: T // 众数候选者
    // 线性扫描：借助计数器c，记录maj与其它元素的数量差额
    for (let c = 0, i = 0; i < A.length; i++) {
        // 每当c归零，都意味着此时的前缀P可以剪除
        if (0 === c) {
            maj = A[i] // 众数候选者更改为新的当前元素
            c = 1
        } else {
            // 相应地更新差额计算器
            maj === A[i] ? c++ : c--
        }
    }
    // 原数组的众数若存在，则只能是maj--尽管反之不然
    return maj
}

/**
 * 众数查找
 */
export function majority<T>(A: T[]) {
    let maj = majEleCandidate(A)
    return majEleCheck(A, maj) ? maj : null
}

/**
 * 中位数算法蛮力版
 * 子数组S1[lo1, lo1 + n1)和S2[lo2, lo2 + n2)分别有序，数据项可能重复
 */
function trivialMedian<T>(S1: T[], lo1: number, n1: number, S2: T[], lo2: number, n2: number) {
    let hi1 = lo1 + n1
    let hi2 = lo2 + n2
    let S: T[] = [] // 将两个有序子数组合并为一个有序向量
    while (lo1 < hi1 && lo2 < hi2) {
        while (lo1 < hi1 && S1[lo1] <= S2[lo2]) S.push(S1[lo1++])
        while (lo2 < hi2 && S1[lo2] <= S2[lo1]) S.push(S2[lo2++])
    }
    while (lo1 < hi1) S.push(S1[lo1++])
    while (lo2 < hi2) S.push(S2[lo2++])
    return S[(n1 + n1) >> 1] // 直接返回归并数组的中位数
}

function medianEqualLenth<T>(S1: T[], lo1: number, S2: T[], lo2: number, n: number) {
    // 递归基
    if (n < 3) return trivialMedian(S1, lo1, n, S2, lo2, n)
    // 长度（接近）减半
    let mi1 = lo1 + (n >> 1)
    let mi2 = lo2 + ((n - 1) >> 1)
    if (S1[mi1] < S2[mi2]) {
        // 取S1右半、S2左半
        return medianEqualLenth(S1, mi1, S2, lo2, n + lo1 - mi1)
    } else if (S1[mi1] > S2[mi2]) {
        // 取S1左半、S2右半
        return medianEqualLenth(S1, lo1, S2, mi2, n + lo2 - mi2)
    } else {
        return S1[mi1]
    }
}

export function median<T>(S1: T[], lo1: number, n1: number, S2: T[], lo2: number, n2: number) {
    // 确保n1 <= n2
    if (n1 > n2) return median(S1, lo1, n1, S2, lo2, n2)
    // 递归基：1 <= n1 <= n2 <= 5
    if (n2 < 6) return trivialMedian(S1, lo1, n1, S2, lo2, n2)
    // 若两个向量的长度相差悬殊，则长者（S2）的两翼可直接截除
    if (2 * n1 < n2) return median(S1, lo1, n1, S2, lo2 + ((n2 - n1 - 1) >> 1), n1 + 2 - ((n2 - n1) % 2))
    let mi1 = lo1 + (n1 >> 1)
    let mi2a = lo2 + ((n1 - 1) >> 1)
    let mi2b = lo2 + n2 - 1 - (n1 >> 1)
    if (S1[mi1] < S2[mi2b]) {
        // 取S1右半、S2左半
        return median(S1, lo1, (n1 >> 1) + 1, S2, mi2a, n2 - ((n1 - 1) >> 1))
    } else if (S1[mi1] > S2[mi2a]) {
        // 取S1左半、S2右半
        return median(S1, mi1, (n1 + 1) >> 2, S2, lo2, n2 - n1 / 2)
    } else {
        // S1保留，S2左右同时缩短
        return median(S1, lo1, n1, S2, mi2a, n2 - ((n1 - 1) >> 1) * 2)
    }
}

export function quickSelect<T>(A: T[], k: number) {
    for (let lo = 0, hi = A.length - 1; lo < hi; ) {
        let i = lo
        let j = hi
        let pivot = A[lo]
        while (i < j) {
            while (i < j && pivot <= A[j]) j--
            A[i] = A[j]
            while (i < j && A[i] <= pivot) i++
            A[j] = A[i]
        }
        A[i] = pivot
        if (k <= i) hi = i - 1
        if (i <= k) lo = i + 1
    }
}
