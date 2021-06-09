import PQ from '../struct/priority_queue'

interface Tree {
    value: number
    bound: number
    children: Tree[]
}

function breadthFirstTreeSearch(T: Tree) {
    let Q: Tree[], u: Tree, v: Tree
    Q = [T]
    console.log(v.value)
    while (Q.length) {
        v = Q.shift()
        for (let i = 0; i < v.children.length; i++) {
            console.log(v.children[i])
            Q.push(v.children[i])
        }
    }
}

function breadthFirstBranchAndBound(T: Tree) {
    let Q: Tree[], u: Tree, v: Tree, best: number
    Q = [T]
    best = T.value
    while (Q.length) {
        v = Q.shift()
        for (let i = 0; i < v.children.length; i++) {
            u = v.children[i]
            if (v.value > best) best = u.value
            if (u.bound > best) Q.push(u)
        }
    }
    return best
}

function bestFirstBranchAndBound(T: Tree) {
    let Q: PQ.CompleteHead<Tree>, u: Tree, v: Tree, best: number
    Q = new PQ.CompleteHead<Tree>()
    Q.insert(T)
    best = T.value
    while (!Q.empty()) {
        v = Q.delMax()
        if (v.bound > best) {
            for (let i = 0; i < v.children.length; i++) {
                u = v.children[i]
                if (v.value > best) best = u.value
                if (u.bound > best) Q.insert(u)
            }
        }
    }
}

export function createKnapsackResolve2(n: number, max: number, weights: number[], prices: number[]) {
    interface Node {
        level: number
        profit: number
        weight: number
    }
    let maxprofit = 0
    const createNode = (level: number, profit: number, weight: number): Node => ({ level, profit, weight })
    const bound = (u: Node) => {
        let j: number, k: number, totweight: number, result: number
        if (u.weight >= max) {
            return 0
        } else {
            result = u.profit
            j = u.level + 1
            totweight = u.weight
            while (j <= n && totweight + weights[j - 1] <= max) {
                totweight += weights[j - 1]
                result += prices[j - 1]
                j++
            }
            k = j
            if (k <= n) {
                result += (max - totweight) * (prices[k - 1] / weights[k - 1])
                return result
            }
        }
    }

    const knapsack = () => {
        let Q: Node[], u: Node, v: Node, best: number
        v = createNode(0, 0, 0)
        Q = [v]
        while (Q.length) {
            v = Q.shift()
            // 设定u为v的一个子节点，设定u为包含下一个物品的子节点
            u = createNode(v.level + 1, v.profit + prices[v.level], v.weight + weights[v.level])
            if (u.weight <= max && u.profit > maxprofit) maxprofit = u.profit
            if (bound(u) > maxprofit) Q.push(u)
            // 设定u为不包含下一个物品的子节点
            u = createNode(v.level + 1, v.profit, v.weight)
            if (bound(u) > maxprofit) Q.push(u)
        }
    }

    return () => {
        knapsack()
        console.log('最大价值:', maxprofit)
    }
}

export function createKnapsackResolve3(n: number, max: number, weights: number[], prices: number[]) {
    interface Node {
        level: number
        profit: number
        weight: number
        bound: number
    }
    const createNode = (level: number, profit: number, weight: number, bound?: number): Node => ({
        level,
        profit,
        weight,
        bound
    })

    let maxprofit = 0
    const bound = (u: Node) => {
        let j: number, k: number, totweight: number, result: number
        if (u.weight >= max) {
            return 0
        } else {
            result = u.profit
            j = u.level + 1
            totweight = u.weight
            while (j <= n && totweight + weights[j - 1] <= max) {
                totweight += weights[j - 1]
                result += prices[j - 1]
                j++
            }
            k = j
            if (k <= n) {
                result += (max - totweight) * (prices[k - 1] / weights[k - 1])
                return result
            }
        }
    }
    const knapsack = () => {
        let Q: PQ.CompleteHead<Node>, u: Node, v: Node
        Q = new PQ.CompleteHead<Node>()
        v = createNode(0, 0, 0, 0)
        v.bound = bound(v)
        Q.insert(v)
        while (!Q.empty()) {
            v = Q.delMax()
            if (v.bound > maxprofit) {
                u = createNode(v.level + 1, v.profit + prices[v.level], v.weight + weights[v.level])
                if (u.weight <= max && u.profit > maxprofit) {
                    maxprofit = u.profit
                }
                u.bound = bound(u)
                if (u.bound > maxprofit) {
                    Q.insert(u)
                }

                u = createNode(v.level + 1, v.profit, v.weight)
                u.bound = bound(u)
                if (u.bound > maxprofit) {
                    Q.insert(u)
                }
            }
        }
    }

    return () => {
        knapsack()
        console.log('最大价值:', maxprofit)
    }
}

export function createTravelResolve() {
    interface Node {
        level: number
        path: number[]
        bound: number
    }
    const W = [
        [0, 14, 4, 10, 20],
        [14, 0, 6, 8, 7],
        [4, 5, 0, 7, 16],
        [11, 7, 9, 0, 2],
        [18, 7, 17, 4, 0]
    ]
    const n = 5
    const createNode = (level: number, path?: number[], bound?: number): Node => ({
        level,
        path,
        bound
    })

    const bound = (u: Node) => {
        let uLength = len(u)
        for (let i = 1; i <= n; i++) {
            let path = u.path.slice(0, u.path.length - 1)
            if (!path.includes(i)) {
                let remain = W[i - 1].filter((_, j) => !u.path.includes(j + 1)).filter(Boolean)
                if (remain.length > 0) {
                    uLength += Math.min(...remain)
                }
            }
        }
        return uLength
    }

    const len = (u: Node) => {
        return u.path.reduce((l, _, i) => {
            return i < u.path.length - 1 ? l + W[u.path[i] - 1][u.path[i + 1] - 1] : l
        }, 0)
    }

    const findLast = (path: number[]) => {
        const total = (n * (n + 1)) / 2
        return total - path.reduce((t, i) => t + i, 0)
    }

    let minlength = Infinity
    let opttour = []

    const travel = () => {
        let Q: PQ.CompleteHead<Node>, u: Node, v: Node
        Q = new PQ.CompleteHead<Node>()
        Q.setCompareFn((a: Node, b: Node) => a.bound < b.bound)
        v = createNode(0, [1]) // 使第一个顶点成为起点
        v.bound = bound(v)
        Q.insert(v)
        while (!Q.empty()) {
            v = Q.delMax()
            // 只有界限小于最小长度才继续
            if (v.bound < minlength) {
                // 所有满足2 ≤ i ≤ n且i不在v.path的值
                for (let i = 2; i <= n; i++) {
                    if (!v.path.includes(i)) {
                        u = createNode(v.level + 1)
                        u.path = v.path.concat(i) // 将i放入path
                        // 检查下一个节点是否完成一条旅程
                        if (u.level === n - 2) {
                            u.path.push(findLast(u.path)) // 添加最后一节点
                            u.path.push(1) // 添加回归节点
                            if (len(u) < minlength) {
                                minlength = len(u)
                                opttour = u.path.slice()
                            }
                        } else {
                            u.bound = bound(u)
                            if (u.bound < minlength) {
                                Q.insert(u)
                            }
                        }
                    }
                }
            }
        }
    }
    return () => {
        travel()
        console.log('minlength', minlength)
        console.log(opttour)
    }
}
