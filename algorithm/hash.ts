function hash1(key: string, size: number) {
    let hashVal = 0
    for (let i = 0; i < key.length; i++) {
        hashVal += key.charCodeAt(i)
    }
    return hashVal % size
}

function hash2(key: string, size: number) {
    return (key[0].charCodeAt(0) + 27 * key[1].charCodeAt(0) + 729 * key[2].charCodeAt(0)) % size
}

function hash3(key: string, size: number) {
    let hashVal = 0
    for (let i = 0; i < key.length; i++) {
        hashVal = (hashVal << 5) + key.charCodeAt(i)
    }
    return hashVal % size
}
