class DisjSet {
    private elements: number[] = []

    init() {
        for (let i = 0; i < 10; i++) {
            this.elements[i] = 0
        }
    }

    setUnion(root1: number, root2: number) {
        if (this.elements[root2] < this.elements[root1]) {
            this.elements[root2] = root1
        } else {
            if (this.elements[root1] === this.elements[root2]) {
                this.elements[root1]--
            }
            this.elements[root2] = root1
        }
    }

    find(x: number): number {
        if (this.elements[x] <= 0) {
            return x
        } else {
            return (this.elements[x] = this.find(this.elements[x]))
        }
    }
}

export default DisjSet
