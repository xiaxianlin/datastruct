import { rand } from '../common/util'

export function createPlaceQueenResolve(n: number) {
    const promising = (i: number, col: number[]): boolean => {
        let k: number = 1,
            flag: boolean = true
        while (k < i && flag) {
            // 检测两个皇后是否在同一列或同一对角线
            if (col[i] === col[k] || Math.abs(col[i] - col[k]) === i - k) {
                flag = false
            }
            k++
        }
        return flag
    }

    const queens = (i: number, col: number[]) => {
        let j: number

        if (promising(i, col)) {
            if (i === n) {
                let data = []
                for (let m = 1; m <= n; m++) data.push(m + ',' + col[m])
                console.log(...data)
            } else {
                for (j = 1; j <= n; j++) {
                    col[i + 1] = j
                    queens(i + 1, col)
                }
            }
        }
    }

    const estimateNQueens = (n: number) => {
        let i: number, j: number, col: number[]
        let m: number, mprod: number, numnodes: number, promChildren: number[]

        i = 0
        numnodes = 1
        m = 1
        mprod = 1
        col = []
        while (m != 0 && i != n) {
            mprod = mprod * m
            numnodes = numnodes + mprod * n
            i++
            m = 0
            promChildren = []
            for (j = 1; j <= n; j++) {
                col[i] = j
                if (promising(i, col)) {
                    m++
                    promChildren = promChildren.concat(j)
                }
            }
            if (m != 0) {
                j = promChildren[rand(0, promChildren.length)]
                col[i] = j
            }
        }
        return numnodes
    }

    return () => {
        console.log('calc count:', estimateNQueens(n))
        let col: number[] = []
        queens(0, col)
    }
}

export function createSumOfSubsetsResolve(target: number, w: number[]) {
    let include: boolean[] = []

    const promising = (i: number, weight: number, total: number) => {
        return weight + total >= target && (weight == target || weight + w[i + 1] <= target)
    }

    const sumOfSubsets = (i: number, weight: number, total: number) => {
        if (promising(i, weight, total)) {
            if (weight === target) {
                let data = []
                for (let m = 1; m <= i; m++) include[m] && data.push(w[m])
                console.log(...data)
            } else {
                include[i + 1] = true
                sumOfSubsets(i + 1, weight + w[i + 1], total - w[i + 1])
                include[i + 1] = false
                sumOfSubsets(i + 1, weight, total - w[i + 1])
            }
        }
    }

    return () => {
        let total = w.reduce((total: number, item: number) => total + item, 0)
        sumOfSubsets(0, 0, total)
    }
}

export function createMColoringResolve(m: number, colors: string[]) {
    const n = 5
    const W = [
        [false, true, true, true, false],
        [true, false, true, false, true],
        [true, true, false, true, true],
        [true, false, true, false, true],
        [false, true, true, true, false]
    ]
    const vcolor: number[] = []
    const promising = (i: number) => {
        let j: number = 1,
            flag: boolean = true
        while (j < i && flag) {
            if (W[i - 1][j - 1] && vcolor[i] == vcolor[j]) flag = false
            j++
        }
        return flag
    }

    const mColoring = (i: number) => {
        let color: number
        if (promising(i)) {
            if (i === n) {
                let data = []
                for (let j = 1; j <= n; j++) data.push('v' + j + ':' + colors[vcolor[j] - 1])
                console.log(...data)
            } else {
                for (color = 1; color <= m; color++) {
                    vcolor[i + 1] = color
                    mColoring(i + 1)
                }
            }
        }
    }

    return () => mColoring(0)
}

export function createHamiltonianResolve() {
    const n = 8
    const W: boolean[][] = [
        [false, true, true, false, false, false, true, true],
        [true, false, true, false, false, false, true, true],
        [true, true, false, true, false, true, false, false],
        [false, false, true, false, true, false, false, false],
        [false, false, false, true, false, true, false, false],
        [false, false, true, false, true, false, true, false],
        [true, true, false, false, false, false, false, true],
        [true, true, false, false, false, false, true, false]
    ]
    const vindex: number[] = [1]
    const promising = (i: number) => {
        let j: number, flag: boolean
        if (i === n - 1 && !W[vindex[n - 1]][vindex[0]]) {
            flag = false
        } else if (i > 0 && !W[vindex[i - 1]][vindex[i]]) {
            flag = false
        } else {
            flag = true
            j = 1
            while (j < i && flag) {
                if (vindex[i] == vindex[j]) flag = false
                j++
            }
        }
        return flag
    }

    const hamiltonian = (i: number) => {
        if (promising(i)) {
            if (i === n - 1) {
                let data = []
                for (let j = 0; j < n; j++) {
                    data.push('v' + vindex[j])
                }
                console.log(data.join('->'))
            } else {
                for (let j = 2; j <= n; j++) {
                    vindex[i + 1] = j
                    hamiltonian(i + 1)
                }
            }
        }
    }

    return () => hamiltonian(0)
}

export function createKnapsackResolve(n: number, max: number, weights: number[], prices: number[]) {
    let maxprofit = 0
    let numbest = 0
    let bestest = []
    let include = []
    const promising = (i: number, profit: number, weight: number) => {
        let j: number, k: number, totweight: number, bound: number
        // console.log(i, profit, weight)
        if (weight >= max) {
            return false // 只有在应当展开一个节点的子节点时，该节点才有展开希望
        } else {
            j = i + 1 // 必须为子节点留出一些空间
            bound = profit
            totweight = weight
            while (j <= n && totweight + weights[j - 1] <= max) {
                // 获取尽可能多的物品
                totweight += weights[j - 1]
                bound += prices[j - 1]
                j++
            }
            k = j // 使用k只是为了与公式一致
            if (k <= n) {
                bound += (max - totweight) * (prices[k - 1] / weights[k - 1]) // 获取第k件物品的一部分
                return bound > maxprofit
            }
        }
    }

    const knapsack = (i: number, profit: number, weight: number) => {
        // 这个集合是到目前最好的
        if (weight <= max && profit > maxprofit) {
            maxprofit = profit
            numbest = i // 设定numbest为所考虑物品的数目
            bestest = include.slice() // 设定bestest为这个解
        }
        if (promising(i, profit, weight)) {
            include[i + 1] = true // 包含weights[i+1]
            knapsack(i + 1, profit + prices[i], weight + weights[i])
            include[i + 1] = false // 不包含weights[i+1]
            knapsack(i + 1, profit, weight)
        }
    }
    return () => {
        knapsack(0, 0, 0)
        for (let j = 1; j <= numbest; j++) {
            if (bestest[j]) {
                console.log('<物品' + (j - 1) + '>', '重量：' + weights[j - 1], '价格：' + prices[j - 1])
            }
        }
        console.log('最大价值:', maxprofit)
    }
}
