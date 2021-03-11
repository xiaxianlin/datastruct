import Stack from './stack'
import { MAX_INT } from '../common/data'
import { BCC, BFS, DFS, Dijkstra, PFS, Prim, TSort } from '../algorithm/graph'

export type PU = (g: Graph<any, any>, uk: number, v: number) => void

export enum VStatus {
    UNDISCOVERD,
    DISCOVERD,
    VISITED
}

export enum EType {
    UNDETERMINED,
    TREE,
    CROSS,
    FORWARD,
    BACKWORD
}

export class Vertex<T> {
    data: T
    inDegree: number
    outDegree: number
    status: VStatus
    dTime: number
    fTime: number
    parent: number
    priority: number
    constructor(
        data: T = null,
        inDegree: number = 0,
        outDegree: number = 0,
        status: VStatus = VStatus.UNDISCOVERD,
        dTime: number = -1,
        fTime: number = -1,
        parent: number = -1,
        priority: number = MAX_INT
    ) {
        this.data = data
        this.inDegree = inDegree
        this.outDegree = outDegree
        this.status = status
        this.dTime = dTime
        this.fTime = fTime
        this.parent = parent
        this.priority = priority
    }
}

export class Edge<T> {
    data: T
    weight: number
    type: EType
    constructor(data: T = null, w: number = 0, t: EType = EType.UNDETERMINED) {
        this.data = data
        this.weight = w
        this.type = t
    }
}

abstract class Graph<Tv, Te> {
    n = 0 // 顶点数
    e = 0 // 边数
    // 重置数据
    protected abstract reset(): void
    // 插入顶点，返回编号
    abstract insertVertex(vertex: Tv): number
    // 删除顶点及其关联边，返回该顶点信息
    abstract removeVertex(i: number): Tv
    // 顶点v的数据
    abstract vertex(i: number): Tv
    // 顶点v的入度
    abstract inDegree(i: number): number
    // 顶点v的出度
    abstract outDegree(i: number): number
    // 顶点v的首个邻接顶点
    abstract firstNbr(i: number): number
    // 顶点v的下一个邻接顶点
    abstract nextNbr(i: number, j: number): number
    // 顶点v的状态
    abstract status(i: number): VStatus
    // 顶点v的时间标签dTime
    abstract dTime(i: number): number
    // 顶点v的时间标签fTime
    abstract fTime(i: number): number
    // 顶点v在遍历树中的父级
    abstract parent(i: number): number
    // 顶点v在遍历树中的优先级数
    abstract priority(i: number): number

    // 边(v, u)是否存在
    abstract exists(i: number, j: number): boolean
    // 在顶点u和v之间插入权重为w的边e
    abstract insertEdge(edge: Te, i: number, j: number, w: number): void
    // 删除顶点v和u之间的边e，返回该边信息
    abstract removeEdge(i: number, j: number): Te
    // 边(v, u)的类型
    abstract type(i: number, j: number): EType
    // 边(v, u)的数据
    abstract edge(i: number, j: number): Te
    // 边(v, u)的权重
    abstract weight(i: number, j: number): number

    // 设置顶点v的入度
    abstract setInDegree(i: number, data: number): void
    // 设置顶点v的出度
    abstract setOutDegree(i: number, data: number): void
    // 设置顶点v的状态
    abstract setStatus(i: number, data: VStatus): void
    // 设置顶点v的dTime
    abstract setDTime(i: number, data: number): void
    // 设置顶点v的fTime
    abstract setFTime(i: number, data: number): void
    // 设置顶点v在遍历树中的父级
    abstract setParent(i: number, data: number): void
    // 设置顶点v在遍历树中的优先级数
    abstract setPriority(i: number, data: number): void
    // 设置边(v, u)的类型
    abstract setType(i: number, j: number, data: EType): void
    // 设置边(v, u)的权重
    abstract setWeight(i: number, j: number, data: number): void

    // 广度优先搜索算法
    bfs(s: number) {
        this.reset()
        let clock = { value: 0 }
        let v = s
        do {
            if (this.status(v) === VStatus.UNDISCOVERD) {
                BFS(this, v, clock)
            }
        } while (s != (v = ++v % this.n))
    }
    // 深度优先搜索算法
    dfs(s: number) {
        this.reset()
        let clock = { value: 0 }
        let v = s
        do {
            if (this.status(v) === VStatus.UNDISCOVERD) {
                DFS(this, v, clock)
            }
        } while (s != (v = ++v % this.n))
    }
    // 基于DFS的双连通分量分解算法
    bcc(s: number) {
        this.reset()
        let clock = { value: 0 }
        let v = s
        let S = new Stack<number>() // 用栈记录访问顶点
        do {
            // 一旦发现未发现的顶点（新连通分量）
            if (this.status(v) === VStatus.UNDISCOVERD) {
                BCC(this, v, clock, S) // 即从该顶点出发启动一次BCC
                S.pop() // 遍历返回后，弹出栈中最后一个点--当前连通域的顶点
            }
        } while (s != (v = ++v % this.n))
    }
    // 基于DFS的拓扑排序算法
    tSort(s: number) {
        this.reset()
        let clock = { value: 0 }
        let v = s
        let S = new Stack<Tv>() // 用栈记录排序顶点
        let result = []
        do {
            if (this.status(v) === VStatus.UNDISCOVERD) {
                if (!TSort(this, v, clock, S)) {
                    // 任一连通域（亦既整图）非DAG
                    while (!S.empty()) {
                        S.pop() // 不比计算，直接返回
                        break
                    }
                }
            }
        } while (s != (v = ++v % this.n))
        while (!S.empty()) {
            result.push(S.pop())
        }
        return result
    }
    // 最小支撑树Prim算法
    prim(s: number) {
        this.reset()
        Prim(this, s)
    }
    // 最短路径Dijkstra算法
    dijkstra(s: number) {
        this.reset()
        Dijkstra(this, s)
    }
    // 优先级搜索框架
    pfs(s: number, prioUpdater: PU) {
        this.reset()
        let v = s
        do {
            if (this.status(v) === VStatus.UNDISCOVERD) PFS(this, s, prioUpdater)
        } while (s != (v = ++v % this.n))
    }
}

export default Graph
