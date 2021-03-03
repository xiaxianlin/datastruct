import { swap } from './util'

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
