function ackermann(i: number, j: number) {
    if (i === 1 && j >= 1) {
        return Math.pow(2, j)
    }

    if (j === 1 && i >= 2) {
        return ackermann(i - 1, 2)
    }

    if (i >= 2 && j >= 2) {
        return ackermann(i - 1, ackermann(i, j - 1))
    }
}
