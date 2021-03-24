import { format } from 'path'
import { UNIT_MAX } from '../common/data'

export function bruteForceMatch1(P: string, T: string) {
    let n = T.length
    let i = 0
    let m = P.length
    let j = 0

    // 自左向右逐个比对字符
    while (j < m && i < n) {
        // 若匹配，转到下一对字符
        if (T[i] === P[j]) {
            i++
            j++
        }
        // 否则，文本串回退、模式串复位
        else {
            i -= j - 1
            j = 0
        }
    }
    return i - j
}
export function bruteForceMatch2(P: string, T: string) {
    let n = T.length
    let i = 0
    let m = P.length
    let j = 0

    for (i = 0; i < n - m + 1; i++) {
        for (j = 0; j < m; j++) {
            if (T[i + j] !== P[j]) break
        }
        if (j >= m) break
    }
    return i
}

function buildNext(P: string) {
    let m = P.length
    let j = 0
    let N: number[] = []
    let t = (N[0] = -1)
    while (j < m - 1) {
        if (0 > t || P[j] === P[t]) {
            j++
            t++
            // N[j] = t
            N[j] = P[j] != P[t] ? t : N[t]
        } else {
            t = N[t]
        }
    }
    return N
}

export function kmp(P: string, T: string) {
    let next = buildNext(P) // 构造next表
    let n = T.length
    let i = 0
    let m = P.length
    let j = 0
    // 自左向右逐个比对字符
    while (j < m && i < n) {
        // 若匹配，或P已移出最左侧，则转到下一个字符
        if (0 > j || T[i] === P[j]) {
            i++
            j++
        }
        // 否则，模式串右移
        else {
            j = next[j]
        }
    }
    return i - j
}

/**
 * 构建坏字符表
 */
function buildBC(P: string) {
    let bc: number[] = [] // bc表与字符表等长
    // 初始化：首先假设所有字符均为在P中出现
    for (let j = 0; j < 256; j++) bc[j] = -1
    // 自左向右扫描模式串P，将字符P[j]的BC项更新为j（单调递增）--画家算法
    for (let m = P.length, j = 0; j < m; j++) bc[P[j].charCodeAt(0)] = j
    return bc
}

/**
 * 构建最大匹配后缀长度表
 */
function buildSS(P: string) {
    let m = P.length
    let ss: number[] = []
    // 对最后一个字符而言，与之匹配的最长后缀就是整个P串
    ss[m - 1] = m
    // 从倒数第二个数起自右向左扫描P，依次计算出ss[]其余各项
    for (let lo = m - 1, hi = m - 1, j = lo - 1; j >= 0; j--) {
        if (lo < j && ss[m - hi + j - 1] <= j - lo) {
            // 直接利用此前已计算出的ss[]
            ss[j] = ss[m - hi + j - 1]
        } else {
            hi = j
            lo = Math.min(lo, hi)
            // 逐个对比处于(lo, hi]前端的字符
            while (0 <= lo && P[lo] == P[m - hi + lo - 1]) lo--
            ss[j] = hi - lo
        }
    }
    return ss
}

/**
 * 构建好后缀位移量表
 */
function buildGS(P: string) {
    let ss = buildSS(P)
    let m = P.length
    let gs: number[] = []
    // 初始化
    for (let j = 0; j < m; j++) gs[j] = m
    // 逆向逐一扫描各字符P[j]
    for (let i = 0, j = m - 1; j > -1; j--) {
        // 若P[0, j] = p[m - j - 1, m)，则
        if (j + i === ss[j]) {
            // 对于p[m - j - 1, m)左侧的各个字符P[i]而言，m - j - 1都是gs[i]的一种选择
            while (i < m - j - 1) gs[i++] = m - j - 1
        }
    }
    // 画家算法：正向扫描P[]各字符，gs[j]不断递减，直至最小
    for (let j = 0; j < m - 1; j++) {
        // m - j - 1必是其gs[m - ss[j] - 1]值的一种选择
        gs[m - ss[j] - 1] = m - j - 1
    }
    return gs
}

export function bm(P: string, T: string) {
    let bc = buildBC(P) // 构建BC表
    let gs = buildGS(P) // 构建GS表
    let i = 0 // 模式串相对于文本串的起始位置（初始时与文本串左对齐）
    // 不断右移模式串
    while (T.length > i + P.length) {
        // 从模式串最末尾的字符开始
        let j = P.length - 1
        // 自右向左比对
        while (P[j] === T[i + j]) if (0 > --j) break
        // 若极大匹配后缀==整个模式串（说明已经完全匹配），返回匹配位置
        if (0 > j) break
        // 否则，适当的移动模式串，位移量根据BC表和GS表选择最大者
        else i += Math.max(gs[j], j - bc[T[i + j].charCodeAt(0)])
    }
    return i
}

const M = 97 // 散列表长度：既然这里并不需要真地存储散列表，不妨取更大的素数，以降低误判的可能
const R = 10 // 基数：对于二进制串，取2；对于十进制串，取10；对于ASCII字符串，取128或256

/**
 * 取十进制串S的第i位数字值
 */
function digit(S: string, i: number) {
    return S[i].charCodeAt(0) - '0'.charCodeAt(0)
}

/**
 * 逐位对比确认是否真正匹配
 */
function check1by1(P: string, T: string, i: number) {
    // 尽管需要O(m)时间，但只要散列得当，调用本例程并返回false的概率极低
    for (let m = P.length, j = 0; j < m; j++, i++) {
        if (P[j] !== T[i]) return false
    }
    return true
}

/**
 * 预处理：计算R^(m - 1) % M（仅需调用一次，不必优化）
 */
function prepareDm(m: number) {
    let Dm = 1
    for (let i = 1; i < m; i++) Dm = (R * Dm) % M
    return Dm
}

/**
 * 子串指纹快速更新算法
 */
function updateHash(hashT: number, T: string, m: number, k: number, Dm: number) {
    // 在前一个指纹基础上，去除首位T[K - 1]
    hashT = (hashT - digit(T, k - 1) * Dm) % M
    // 添加末尾T[k + m - 1]
    hashT = (hashT * R + digit(T, k + m - 1)) % M
    // 确保散列码落在合法区间
    if (0 > hashT) hashT += M
    return hashT
}

export function karpRabin(P: string, T: string) {
    let m = P.length
    let n = T.length
    let Dm = prepareDm(m)
    let hashP = 0
    let hashT = 0
    // 初始化
    for (let i = 0; i < m; i++) {
        // 计算模式串对应的散列值
        hashP = (hashP * R + digit(P, i)) % M
        // 计算文本串（前m位）的初始散列值
        hashT = (hashT * R + digit(T, i)) % M
    }
    // 查找
    for (let k = 0; ; ) {
        if (hashT === hashP) if (check1by1(P, T, k)) return k
        if (++k > n - m) return -1
        else hashT = updateHash(hashT, T, m, k, Dm)
    }
}
