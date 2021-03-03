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
