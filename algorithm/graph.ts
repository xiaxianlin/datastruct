import Queue from '../struct/queue'
import Graph, { VStatus, EType, PU } from '../struct/graph'
import Stack from '../struct/stack'
import { MAX_INT } from '../common/data'

interface Clock {
    value: number
}

/**
 * （连通域）广度优先搜索算法
 */
export function BFS(g: Graph<any, any>, v: number, clock: Clock) {
    let Q = new Queue<number>() // 辅助队列
    // 初始化起点
    g.setStatus(v, VStatus.DISCOVERD)
    Q.enqueue(v)
    while (!Q.empty()) {
        // 取出首顶点v
        let v = Q.dequeue()
        g.setDTime(v, ++clock.value)
        // 枚举v的所有邻居u
        for (let u = g.firstNbr(v); -1 < u; u = g.nextNbr(v, u)) {
            // 若u尚未被发现，则
            if (g.status(u) === VStatus.UNDISCOVERD) {
                // 发现该顶点
                g.setStatus(u, VStatus.DISCOVERD)
                Q.enqueue(u)
                // 引入树边拓展支撑树
                g.setType(v, u, EType.TREE)
                g.setParent(u, v)
            }
            // 若u被发现，或者甚至已访问完毕，则
            else {
                // 将(v, u)归类于跨边
                g.setType(v, u, EType.CROSS)
            }
        }
    }
    g.setStatus(v, VStatus.VISITED) // 至此，当前顶点访问完毕
}

/**
 * （连通域）深度优先搜索算法
 */
export function DFS(g: Graph<any, any>, v: number, clock: Clock) {
    // 发现当前顶点v
    g.setDTime(v, ++clock.value)
    g.setStatus(v, VStatus.DISCOVERD)
    // 枚举v的所有邻居u
    for (let u = g.firstNbr(v); -1 < u; u = g.nextNbr(v, u)) {
        // 视其状态分别处理
        switch (g.status(u)) {
            // u尚未发现，意味着支撑树可在此拓展
            case VStatus.UNDISCOVERD:
                g.setType(v, u, EType.TREE)
                g.setParent(u, v)
                DFS(g, u, clock)
                break
            // u已被发现但尚未访问完毕，应属被后代指向的祖先
            case VStatus.DISCOVERD:
                g.setType(v, u, EType.BACKWORD)
                break
            // u已访问完毕（VISITED，有向图），则视承袭关系分为前向边向或跨边
            default:
                console.log('v', g.vertex(v), g.status(v), g.dTime(v))
                console.log('u', g.vertex(u), g.status(u), g.dTime(u))
                let type = g.dTime(u) < g.dTime(v) ? EType.FORWARD : EType.CROSS
                g.setType(v, u, type)
                if (type === EType.CROSS) {
                    g.setParent(u, v)
                }
                break
        }
    }
    // 至此，当前顶点访问完毕
    g.setStatus(v, VStatus.VISITED)
    g.setFTime(v, ++clock.value)
}

/**
 * （连通域）基于DFS的双连通分量分解算法
 */
export function BCC(g: Graph<any, any>, v: number, clock: Clock, S: Stack<number>) {
    ++clock.value
    g.setDTime(v, clock.value)
    g.setFTime(v, clock.value)
    g.setStatus(v, VStatus.DISCOVERD)
    S.push(v)
    for (let u = g.firstNbr(v); -1 < u; u = g.nextNbr(v, u)) {
        // 视其状态分别处理
        switch (g.status(u)) {
            case VStatus.UNDISCOVERD:
                // 从顶点u处深入
                g.setParent(u, v)
                g.setType(v, u, EType.TREE)
                BCC(g, u, clock, S)
                // 遍历返回后，若发现u（通过后向边）可指向v的真祖先
                if (g.fTime(u) < g.dTime(v)) {
                    // 则v亦必如此
                    g.setFTime(v, Math.min(g.fTime(v), g.fTime(u)))
                }
                // 否则，以v为关节点（u以下即是一个BCC，且其中顶点此时正集中于栈S的顶部）
                else {
                    // 依次弹出当前BCC中的节点，亦可根据实际需求转存至其他结构
                    while (v !== S.pop());
                    S.push(v) // 最后一个顶点（关节点）重新入栈--分摊不足一次
                }
                break
            case VStatus.DISCOVERD:
                g.setType(v, u, EType.BACKWORD) // 标记(v, u)，并按照“越小越高”的准则
                if (u !== g.parent(v)) {
                    g.setFTime(v, Math.min(g.fTime(v), g.dTime(u))) // 更新v
                }
                break
            // VISITED(diagraphs only)
            default:
                g.setType(v, u, g.dTime(v) < g.dTime(u) ? EType.FORWARD : EType.CROSS)
                break
        }
    }
    // 至此，当前顶点访问完毕
    g.setStatus(v, VStatus.VISITED)
}

/**
 * （连通域）基于DFS的拓扑排序算法
 */
export function TSort(g: Graph<any, any>, v: number, clock: Clock, S: Stack<any>) {
    g.setDTime(v, ++clock.value)
    g.setStatus(v, VStatus.DISCOVERD)
    // 枚举v的所有邻居u
    for (let u = g.firstNbr(v); -1 < u; u = g.nextNbr(v, u)) {
        // 视其状态分别处理
        switch (g.status(u)) {
            case VStatus.UNDISCOVERD:
                g.setParent(u, v)
                g.setType(v, u, EType.TREE)
                // 从顶点u处出发深入搜索，若u及其后代不能拓扑排序，故返回并报告
                if (!TSort(g, u, clock, S)) return false
                break
            case VStatus.DISCOVERD:
                g.setType(v, u, EType.BACKWORD) // 一旦发现后向边（非DAT），则
                return false // 不必深入，故返回并报告
            default:
                g.setType(v, u, g.dTime(u) < g.dTime(v) ? EType.FORWARD : EType.CROSS)
                break
        }
    }
    // 顶点被标记为VISITED时，随即入栈
    g.setStatus(v, VStatus.VISITED)
    S.push(g.vertex(v))
    return true
}

/**
 * （连通域）优先级搜索框架
 */
export function PFS(g: Graph<any, any>, s: number, prioUpdater: PU) {
    g.setPriority(s, 0)
    g.setStatus(s, VStatus.DISCOVERD)
    while (true) {
        // 枚举s的所有邻居w
        for (let w = g.firstNbr(s); -1 < w; w = g.nextNbr(s, w)) {
            prioUpdater(this, s, w)
        }
        for (let shortest = MAX_INT, w = 0; w < g.n; w++) {
            if (g.status(w) === VStatus.UNDISCOVERD && shortest > g.priority(w)) {
                shortest = g.priority(w)
                s = w
            }
        }
        if (g.status(s) === VStatus.VISITED) break
        g.setStatus(s, VStatus.VISITED)
        g.setType(g.parent(s), s, EType.TREE)
    }
}

/**
 * Prim算法
 * 无向连通图，各边表示为方向互逆、权重相等的一对边
 */
export function Prim(g: Graph<any, any>, s: number) {
    g.setPriority(s, 0)
    // 共需引入n个顶点和n-1条边
    for (let i = 0; i < g.n; i++) {
        g.setStatus(s, VStatus.VISITED)
        if (g.parent(s) !== -1) g.setType(g.parent(s), s, EType.TREE) // 引入当前的s
        // 枚举s的所有邻居w
        for (let w = g.firstNbr(s); -1 < w; w = g.nextNbr(s, w)) {
            // 对邻接顶点j做松弛
            if (g.status(w) === VStatus.UNDISCOVERD && g.priority(w) > g.weight(s, w)) {
                g.setPriority(w, g.weight(s, w))
                g.setParent(w, s)
            }
        }
        // 选出下一极短跨边
        for (let shortest = MAX_INT, w = 0; w < g.n; w++) {
            if (g.status(w) === VStatus.UNDISCOVERD && shortest > g.priority(w)) {
                shortest = g.priority(w)
                s = w
            }
        }
    }
}

/**
 * Dijkstra算法
 * 适用于一般的有向图，对于无向连通图，假设每一条边表示为方向互逆、权重相等的一对边
 */
export function Dijkstra(g: Graph<any, any>, s: number) {
    g.setPriority(s, 0)
    // 共需引入n个顶点和n-1条边
    for (let i = 0; i < g.n; i++) {
        g.setStatus(s, VStatus.VISITED)
        if (g.parent(s) !== -1) g.setType(g.parent(s), s, EType.TREE) // 引入当前的s
        // 枚举s的所有邻居w
        for (let w = g.firstNbr(s); -1 < w; w = g.nextNbr(s, w)) {
            // 对邻接顶点j做松弛
            if (g.status(w) === VStatus.UNDISCOVERD && g.priority(w) > g.priority(s) + g.weight(s, w)) {
                g.setPriority(w, g.priority(s) + g.weight(s, w))
                g.setParent(w, s)
            }
        }
        // 选出下一极短跨边
        for (let shortest = MAX_INT, w = 0; w < g.n; w++) {
            if (g.status(w) === VStatus.UNDISCOVERD && shortest > g.priority(w)) {
                shortest = g.priority(w)
                s = w
            }
        }
    }
}

/**
 * 针对BFS算法的顶点优先级更新器
 */
export function bfsPU(g: Graph<any, any>, uk: number, v: number) {
    // 对于uk每一尚未被发现的邻接顶点v
    if (g.status(v) === VStatus.UNDISCOVERD) {
        // 将其到起点的距离作为优先级数
        if (g.priority(v) > g.priority(uk) + 1) {
            g.setPriority(v, g.priority(uk) + 1) // 更新优先级数
            g.setParent(v, uk) // 更新父节点
        }
    }
}

/**
 * 针对DFS算法的顶点优先级更新器
 */
export function dfsPU(g: Graph<any, any>, uk: number, v: number) {
    // 对于uk每一尚未被发现的邻接顶点v
    if (g.status(v) === VStatus.UNDISCOVERD) {
        // 将其到起点的复数作为优先级数
        if (g.priority(v) > g.priority(uk) - 1) {
            g.setPriority(v, g.priority(uk) - +1) // 更新优先级数
            g.setParent(v, uk) // 更新父节点
            return true
        }
    }
    return false
}

/**
 * 针对Prim算法的顶点优先级更新器
 */
export function primPU(g: Graph<any, any>, uk: number, v: number) {
    // 对于uk每一尚未被发现的邻接顶点v
    if (g.status(v) === VStatus.UNDISCOVERD) {
        // 按Prim策略做松弛
        if (g.priority(v) > g.weight(uk, v)) {
            g.setPriority(v, g.weight(uk, v)) // 更新优先级数
            g.setParent(v, uk) // 更新父节点
        }
    }
}

/**
 * 针对Dijkstra算法的顶点优先级更新器
 */
export function dijkstraPU(g: Graph<any, any>, uk: number, v: number) {
    // 对于uk每一尚未被发现的邻接顶点v
    if (g.status(v) === VStatus.UNDISCOVERD) {
        // 按Dijkstra策略做松弛
        if (g.priority(v) > g.priority(uk) + g.weight(uk, v)) {
            g.setPriority(v, g.priority(uk) + g.weight(uk, v)) // 更新优先级数
            g.setParent(v, uk) // 更新父节点
        }
    }
}
