export function prattSequence(max: number) {
    let seq: number[] = []
    let pow3 = 1
    while (pow3 <= max) {
        let pow2 = pow3
        while (pow2 <= max) {
            seq.push(pow2)
            pow2 = pow2 * 2
        }
        pow3 = pow3 * 3
    }
    return seq
}

export function sedgewickSequence(max: number) {
    let seq: number[] = []
    for (let i = 0, item = 0; ; i++) {
        item = 9 * Math.pow(4, i) - 9 * Math.pow(2, i) + 1
        if (item > max) break
        seq[i] = item
    }
    return seq
}

export function knuthSequence(max: number) {
    let seq: number[] = []
    for (let i = 0, item = 0; ; i++) {
        item = (Math.pow(3, i + 1) - 1) >> 1
        if (item > max) break
        seq[i] = item
    }
    return seq
}

export function papernovStasevicSequence(max: number) {
    let seq: number[] = []
    for (let i = 0, item = 0; ; i++) {
        item = Math.pow(2, i + 1) - 1
        if (item > max) break
        seq[i] = item
    }
    return seq
}
