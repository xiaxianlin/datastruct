class Queen {
    x = 0
    y = 0

    constructor(x: number = 0, y: number = 0) {
        this.x = x
        this.y = y
    }

    equal(q: Queen) {
        return q.x === this.x || q.y === this.y || q.x + q.y === this.x + this.y || q.x - q.y === this.x - this.y
    }
}

export default Queen
