import Graph, { Edge, EType, Vertex, VStatus } from './graph'

class GraphMatrix<Tv, Te> extends Graph<Tv, Te> {
    private _V = new Array<Vertex<Tv>>() // 顶点集
    private _E = new Array<Array<Edge<Te>>>() // 边集（邻接矩阵）

    protected reset() {
        for (let i = 0; i < this.n; i++) {
            this._V[i] = new Vertex<Tv>(this.vertex(i))
            for (let j = 0; j < this.n; j++) {
                if (this.exists(i, j)) {
                    this._E[i][j].type = EType.UNDETERMINED
                }
            }
        }
    }

    // 插入顶点，返回编号
    insertVertex(vertex: Tv) {
        // 各顶点预留一条潜在的关联边
        for (let j = 0; j < this.n; j++) {
            this._E[j].push(null)
        }
        this.n++
        // 创建新顶点对应的边向量
        let data = new Array<Edge<Te>>()
        for (let i = 0; i < this.n; i++) data[i] = null
        this._E.push(data)
        // 顶点向量增加一个顶点
        return this._V.push(new Vertex<Tv>(vertex)) - 1
    }
    // 删除顶点及其关联边，返回该顶点信息
    removeVertex(i: number) {
        // 所有出边，逐条删除
        for (let j = 0; j < this.n; j++) {
            if (this.exists(i, j)) {
                this._E[i][j] = null
                this._V[j].inDegree--
            }
        }
        this._E.splice(i, 1) // 删除第i行
        this.n--
        let vBak = this.vertex(i)
        this._V.splice(i, 0) // 删除顶点i
        // 所有入边，逐条删除
        for (let j = 0; j < this.n; j++) {
            this._E[j].splice(i, 1)
            this._V[j].inDegree--
        }
        return vBak
    }
    // 顶点v的数据
    vertex(i: number) {
        return this._V[i].data
    }
    // 顶点v的入度
    inDegree(i: number) {
        return this._V[i].inDegree
    }
    // 顶点v的出度
    outDegree(i: number) {
        return this._V[i].outDegree
    }
    // 顶点v的首个邻接顶点
    firstNbr(i: number) {
        return this.nextNbr(i, this.n)
    }
    // 顶点v的下一个邻接顶点
    nextNbr(i: number, j: number) {
        while (-1 < j && !this.exists(i, --j));
        return j
    }
    // 顶点v的状态
    status(i: number) {
        return this._V[i].status
    }
    // 顶点v的时间标签dTime
    dTime(i: number) {
        return this._V[i].dTime
    }
    // 顶点v的时间标签fTime
    fTime(i: number) {
        return this._V[i].fTime
    }
    // 顶点v在遍历树中的父级
    parent(i: number) {
        return this._V[i].parent
    }
    // 顶点v在遍历树中的优先级数
    priority(i: number) {
        return this._V[i].priority
    }

    // 边(v, u)是否存在
    exists(i: number, j: number) {
        return 0 <= i && i < this.n && 0 <= j && j < this.n && this._E[i][j] != null
    }
    // 在顶点u和v之间插入权重为w的边e
    insertEdge(edge: Te, i: number, j: number, w: number) {
        if (this.exists(i, j)) return
        this._E[i][j] = new Edge<Te>(edge, w)
        this.e++
        this._V[i].outDegree++
        this._V[j].inDegree++
    }
    // 删除顶点v和u之间的边e，返回该边信息
    removeEdge(i: number, j: number) {
        let eBak = this.edge(i, j)
        this._E[i][j] = null
        this.e--
        this._V[i].outDegree--
        this._V[j].inDegree--
        return eBak
    }
    // 边(v, u)的类型
    type(i: number, j: number) {
        return this._E[i][j].type
    }
    // 边(v, u)的数据
    edge(i: number, j: number) {
        return this._E[i][j].data
    }
    // 边(v, u)的权重
    weight(i: number, j: number) {
        return this._E[i][j].weight
    }

    bfs(s: number) {
        super.bfs(s)
        this._V.forEach((e, i) => console.log(i, e.data, e.parent))
    }

    dfs(s: number) {
        super.dfs(s)
        this._V.forEach((e, i) => console.log(i, e.data, e.parent))
    }

    bcc(s: number) {
        super.bcc(s)
        this._V.forEach((e, i) => console.log(i, e.data, e.parent))
    }

    tSort(s: number) {
        let result = super.tSort(s)
        console.log(result)
        return result
    }

    prim(s: number) {
        super.prim(s)
        this._V.forEach((e, i) => console.log(i, e.data, e.parent))
    }

    dijkstra(s: number) {
        super.dijkstra(s)
        this._V.forEach((e, i) => console.log(i, e.data, e.parent))
    }

    setInDegree(i: number, data: number) {
        if (i >= this.n) return
        this._V[i].inDegree = data
    }
    setOutDegree(i: number, data: number) {
        if (i >= this.n) return
        this._V[i].outDegree = data
    }
    setStatus(i: number, data: VStatus) {
        if (i >= this.n) return
        this._V[i].status = data
    }
    setDTime(i: number, data: number) {
        if (i >= this.n) return
        this._V[i].dTime = data
    }
    setFTime(i: number, data: number) {
        if (i >= this.n) return
        this._V[i].fTime = data
    }
    setParent(i: number, data: number) {
        if (i >= this.n) return
        this._V[i].parent = data
    }
    setPriority(i: number, data: number) {
        if (i >= this.n) return
        this._V[i].priority = data
    }
    setType(i: number, j: number, data: EType) {
        if (!this.exists(i, j)) return
        this._E[i][j].type = data
    }
    setWeight(i: number, j: number, data: number) {
        if (!this.exists(i, j)) return
        this._E[i][j].weight = data
    }
}

export default GraphMatrix
