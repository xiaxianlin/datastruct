class NodeType {
    parent: number
    depth: number
    smallest: number
}

class DisjointSet {
    U: NodeType[] = []
    constructor(n: number) {
        for (let i = 0; i < n; i++) {
            this.makeset(i)
        }
    }

    makeset(i: number) {
        this.U[i] = new NodeType()
        this.U[i].parent = i
        this.U[i].depth = 0
        this.U[i].smallest = i
    }

    find(i: number) {
        let j = i
        while (this.U[i].parent !== j) {
            j = this.U[j].parent
        }
        return j
    }

    equal(p: number, q: number) {
        return p === q
    }

    merge(p: number, q: number) {
        let u = this.U
        if (u[p].depth >= u[q].depth) {
            if ((u[p].depth -= u[q].depth)) u[p].depth += 1
            u[q].parent = p
            if (u[q].smallest < u[p].smallest) {
                u[p].smallest = u[q].smallest
            }
        } else {
            u[p].parent = q
            if (u[p].smallest < u[q].smallest) {
                u[q].smallest = u[p].smallest
            }
        }
    }

    small(p: number) {
        return this.U[p].smallest
    }
}

export function minSpanningTree() {
    const prim = (n: number, W: number[][]) => {
        let i: number, vnear: number, min: number, e: number[]
        let Y: number[] = [0]
        let F: number[][] = []
        let nearest: number[] = [] // Y中与vi最接近的顶点的索引
        let distance: number[] = [] // 一条边的权重，该边位于vi与索引为narest[i]的顶点之间

        for (i = 1; i < n; i++) {
            nearest[i] = 0 // 对于所有顶点，将V0初始化为Y中的最近顶点
            distance[i] = W[0][i] // 将于Y的距离初始化为到V0的边上的权重
        }

        // 将所有n-1个顶点加入Y中
        for (let k = 0; k < n - 1; k++) {
            min = Infinity
            // 检测每个顶点是否与Y最近
            for (i = 1; i < n; i++) {
                if (distance[i] != -1 && distance[i] < min) {
                    min = distance[i]
                    vnear = i
                }
            }
            // 连接两个顶点的边，这两个顶点以vnear和nearest[vnear]为索引
            e = [nearest[vnear], vnear]
            F.push(e)
            // 将以vnear为索引的点加入Y中
            Y.push(vnear)
            distance[vnear] = -1

            for (i = 1; i < n; i++) {
                // 对于每个不在Y中的顶点，更新它与Y的距离
                if (W[i][vnear] < distance[i]) {
                    distance[i] = W[i][vnear]
                    nearest[i] = vnear
                }
            }
        }

        return { F, Y }
    }

    const kruskal = (n: number, W: number[][]) => {
        let p: number, q: number
        let edges: number[][] = [
            [0, 1],
            [2, 4],
            [0, 2],
            [1, 2],
            [2, 3],
            [3, 4],
            [1, 3]
        ]
        let F: number[][] = []
        let set = new DisjointSet(n)
        while (F.length < n - 1) {
            let e = edges.shift()
            p = set.find(e[0])
            q = set.find(e[1])
            if (!set.equal(p, q)) {
                set.merge(p, q)
                F.push(e)
            }
        }
        return { F, set }
    }

    let W: number[][] = [
        [0, 1, 3, Infinity, Infinity],
        [1, 0, 3, 6, Infinity],
        [3, 3, 0, 4, 2],
        [Infinity, 6, 4, 0, 5],
        [Infinity, Infinity, 2, 5, 0]
    ]

    let res1 = prim(5, W)
    console.log(res1.F)

    let res2 = kruskal(5, W)
    console.log(res2.F)
}

export function shortestPath() {
    const dijkstra = (n: number, W: number[][]) => {
        let i: number, vnear: number, min: number
        let e: number[] = []
        let touch: number[] = []
        let length: number[] = []
        let F: number[][] = []
        let P: number[] = []
        for (i = 1; i < n; i++) {
            touch[i] = 0
            length[i] = W[0][i]
        }

        for (let k = 0; k < n - 1; k++) {
            min = Infinity
            for (i = 1; i < n; i++) {
                if (0 <= length[i] && length[i] < min) {
                    min = length[i]
                    vnear = i
                }
            }
            e = [touch[vnear], vnear]
            F.push(e)
            for (i = 1; i < n; i++) {
                if (length[vnear] + W[vnear][i] < length[i]) {
                    length[i] = length[vnear] + W[vnear][i]
                    touch[i] = vnear
                }
            }
            length[vnear] = -1
        }

        console.log(P)
        return F
    }
    let W: number[][] = [
        [0, 7, 4, 6, 1],
        [Infinity, 0, Infinity, Infinity, Infinity],
        [Infinity, 2, 0, 5, Infinity],
        [Infinity, 3, Infinity, 0, Infinity],
        [Infinity, Infinity, Infinity, 1, 0]
    ]
    let W6: number[][] = [
        [0, 10, 4, 6, 1, Infinity],
        [Infinity, 0, Infinity, Infinity, Infinity, Infinity],
        [Infinity, 2, 0, 5, Infinity, Infinity],
        [Infinity, Infinity, Infinity, 0, Infinity, 3],
        [Infinity, Infinity, Infinity, 1, 0, Infinity],
        [Infinity, 2, Infinity, Infinity, Infinity, 0]
    ]

    let F = dijkstra(W.length, W)
    // let F = dijkstra(W6.length, W6)
    console.log(F)
}
