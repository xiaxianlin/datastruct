namespace Search {
    export function seqsrch(S: number[], x: number) {
        let position: number = -1
        while (position < S.length && S[position] !== x) {
            position++
        }
        if (position >= S.length) {
            position = -1
        }
        return position
    }

    export function binsrch(S: number[], x: number) {
        let i: number = -1,
            low: number = 0,
            high: number = S.length - 1,
            mid: number = -1

        while (low <= high && i === -1) {
            mid = Math.floor((low + high) / 2)
            if (x === S[mid]) {
                i = mid
            } else if (x < S[mid]) {
                high = mid - 1
            } else {
                low = mid + 1
            }
        }
        return i
    }

    export function interpsrch(S: number[], x: number) {
        let denominator: number, gap: number
        let i: number = -1,
            low: number = 0,
            high: number = S.length - 1,
            mid: number = -1

        if (S[low] <= x && x <= S[high]) {
            while (low <= high && i === -1) {
                denominator = S[high] - S[low]
                if (denominator === 0) {
                    mid = low
                } else {
                    // mid = low + Math.floor(((x - S[low]) * (high - low)) / denominator)
                    // 强壮插值公式
                    gap = Math.floor(Math.pow(high - low + 1, 0.5))
                    console.log('gap', gap)
                    mid = Math.min(high - gap, Math.max(mid, low + gap))
                }
                if (x === S[mid]) {
                    i = mid
                } else if (x < S[mid]) {
                    high = mid - 1
                } else {
                    low = mid + 1
                }
            }
        }
        return i
    }

    export function largest(S: number[]) {
        let large = S[0]
        for (let i = 1; i < S.length; i++) {
            if (S[i] > large) large = S[i]
        }
        return large
    }

    export function both(S: number[]) {
        let large = S[0],
            small = S[0]
        for (let i = 1; i < S.length; i++) {
            if (S[i] > large) large = S[i]
            else if (S[i] < small) small = S[i]
        }
        return [small, large]
    }

    export function both2(S: number[]) {
        let i: number, small: number, large: number
        if (S[0] < S[1]) {
            small = S[0]
            large = S[1]
        } else {
            small = S[1]
            large = S[0]
        }
        for (i = 2; i < S.length; i = i + 2) {
            if (S[i] < S[i + 1]) {
                if (S[i] < small) small = S[i]
                if (S[i + 1] > large) large = S[i + 1]
            } else {
                if (S[i + 1] < small) small = S[i + 1]
                if (S[i] > large) large = S[i]
            }
        }
        return [small, large]
    }

    function swap(S: number[], i: number, j: number) {
        let t = S[i]
        S[i] = S[j]
        S[j] = t
    }

    function partition(S: number[], low: number, high: number) {
        let i: number, j: number, pivotitem: number
        // randspot = 根据分布在low与high（含）之间的随机选择index
        let randspot = low
        pivotitem = S[randspot]
        j = low
        for (i = low + 1; i <= high; i++) {
            if (S[i] < pivotitem) {
                j++
                swap(S, i, j)
            }
        }
        swap(S, low, j)
        return j
    }

    export function selection(S: number[], k: number) {
        k = k - 1
        const instance = (low: number, high: number) => {
            if (low === high) {
                return S[low]
            } else {
                let pivotpoint = partition(S, low, high)
                if (k === pivotpoint) {
                    return S[pivotpoint]
                } else if (k < pivotpoint) {
                    return instance(low, pivotpoint - 1)
                } else {
                    return instance(pivotpoint + 1, high)
                }
            }
        }
        return instance(0, S.length - 1)
    }

    function partition2(S: number[], low: number, high: number) {
        let arraysize = high - low + 1
        let r = Math.ceil(arraysize / 5)
        let i: number, j: number, first: number, last: number
        let pivotitem: number,
            T: number[] = [],
            mark: number = 0

        for (i = 1; i <= r; i++) {
            first = low + 5 * i - 5
            last = Math.min(low + 5 * i - 1, arraysize - 1)
            T[i - 1] = S[first + Math.floor((last - first) / 2)]
        }
        pivotitem = selection2(T, Math.floor(r / 2))
        j = low
        for (i = low; i < high; i++) {
            if (S[i] === pivotitem) {
                swap(S, i, j)
                mark = j
                j++
            } else if (S[i] < pivotitem) {
                swap(S, i, j)
                j++
            }
        }
        swap(S, mark, j)
        return j
    }

    export function selection2(S: number[], k: number) {
        const instance = (low: number, high: number) => {
            if (low === high) {
                return S[low]
            } else {
                let pivotpoint = partition2(S, low, high)
                if (k === pivotpoint) {
                    return S[pivotpoint]
                } else if (k < pivotpoint) {
                    return instance(low, pivotpoint - 1)
                } else {
                    return instance(pivotpoint + 1, high)
                }
            }
        }
        return instance(0, S.length - 1)
    }
}

export default Search
