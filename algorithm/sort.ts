import { format } from 'path'
import { rand, swap } from '../common/util'

function bubble<T>(A: T[], lo: number, hi: number) {
    // 整体有序标准
    let sorted = true
    // 自左向右，逐一检查各对相邻元素
    while (++lo <= hi) {
        // 若逆序
        if (A[lo - 1] > A[lo]) {
            sorted = false
            // 交互元素
            swap(A, lo - 1, lo)
        }
    }
    return sorted
}

export function bubbleSort<T>(A: T[], lo: number, hi: number) {
    // 逐趟做扫描交换，直至全序
    while (!bubble(A, lo, hi--));
}

function merge<T>(A: T[], lo: number, mi: number, hi: number) {
    let lb = mi - lo, // 前子区间长度
        lc = hi - mi // 后子区间长度

    let B = A.slice(lo, mi), // 前子区间[lo, mi)
        C = A.slice(mi, hi++) // 后子区间[mi, hi]
    // B[j]和C[k]中小者续至末尾
    for (let i = lo, j = 0, k = 0; j < lb || k < lc; ) {
        if (j < lb && (!(k < lc) || B[j] <= C[k])) A[i++] = B[j++]
        if (k < lc && (!(j < lb) || C[k] < B[j])) A[i++] = C[k++]
    }
}

export function mergeSort<T>(A: T[], lo: number, hi: number) {
    if (hi - lo < 2) return
    // 以中点为界
    let mi = (lo + hi + 1) >> 1
    // 分别排序
    mergeSort(A, lo, mi)
    mergeSort(A, mi, hi)
    // 归并
    merge(A, lo, mi, hi)
}

export function insertionSort<T>(A: T[]) {
    for (let i = 1; i < A.length; i++) {
        let p = A[i]
        for (let j = i; j > 0 && p < A[j - 1]; j--) {
            A[j] = A[j - 1]
            A[j - 1] = p
        }
    }
}

export function selectionSort<T>(A: T[]) {
    for (let i = A.length - 1; i > 0; i--) {
        let max = i,
            d = A[max]
        for (let j = 0; j < i; j++) {
            if (A[j] > A[max]) max = j
        }
        A[i] = A[max]
        A[max] = d
    }
}

function partition1<T>(A: T[], lo: number, hi: number) {
    swap(A, lo, lo + rand(hi - lo)) // 随机交换首元素，使轴点随机
    let pivot = A[lo] // 以首元素为轴
    // 从数组的两端交替向中间扫描
    while (lo < hi) {
        // 在不小于pivot的前提下，向左拓展右端子数组
        while (lo < hi && pivot <= A[hi]) hi--
        // 小于pivot者归入左侧子序列
        A[lo] = A[hi]
        // 在不大于pivot的前提下，向右拓展左端子数组
        while (lo < hi && pivot >= A[lo]) lo++
        // 大于pivot者归入右侧子序列
        A[hi] = A[lo]
    }
    // 将备份的轴点记录置于前、后数组之间
    A[lo] = pivot
    return lo
}

function partition2<T>(A: T[], lo: number, hi: number) {
    swap(A, lo, lo + rand(hi - lo)) // 随机交换首元素，使轴点随机
    let pivot = A[lo] // 以首元素为轴
    // 从数组的两端交替向中间扫描
    while (lo < hi) {
        // 在不小于pivot的前提下，向左拓展右端子数组
        while (lo < hi && pivot < A[hi]) hi--
        // 小于pivot者归入左侧子序列
        if (lo < hi) A[lo++] = A[hi]
        // 在不大于pivot的前提下，向右拓展左端子数组
        while (lo < hi && A[lo] < pivot) lo++
        // 大于pivot者归入右侧子序列
        if (lo < hi) A[hi--] = A[lo]
    }
    // 将备份的轴点记录置于前、后数组之间
    A[lo] = pivot
    return lo
}

export function quickSort<T>(A: T[], lo: number, hi: number) {
    if (hi - lo < 2) return
    let mi = partition2(A, lo, hi - 1) // 构造轴点
    quickSort(A, lo, mi) // 对前缀递归排序
    quickSort(A, mi + 1, hi) // 对后缀递归排序
}

export function shellSortByFib<T>(A: T[], lo: number, hi: number) {
    for (let d = 0x3fffff; 0 < d; d >>= 1) {
        for (let j = lo + d; j < hi; j++) {
            let x = A[j]
            let i = j - d
            while (lo <= i && A[i] > x) {
                A[i + d] = A[i]
                i -= d
            }
            A[i + d] = x
        }
    }
}

export function shellSort<T>(A: T[], generator: (max: number) => number[]) {
    let seq = generator(A.length)
    let i: number, j: number
    for (let k = seq.length - 1; k >= 0; k--) {
        let d = seq[k]
        console.log(d)
        for (i = d; i < A.length; i++) {
            let x = A[i]
            for (j = i; j >= d && A[j - d] > x; j -= d) A[j] = A[j - d]
            A[j] = x
        }
    }
}
