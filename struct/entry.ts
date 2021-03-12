class Entry<K, V> {
    key: K
    value: V

    constructor(k?: Entry<K, V> | K, v?: V) {
        if (k instanceof Entry && !v) {
            this.key = k.key
            this.value = k.value
        }

        if (k && v) {
            this.key = k as K
            this.value = v
        }
    }

    lt(e: Entry<K, V>) {
        return this.key < e.key
    }
    gt(e: Entry<K, V>) {
        return this.key > e.key
    }
    lte(e: Entry<K, V>) {
        return this.key <= e.key
    }
    gte(e: Entry<K, V>) {
        return this.key >= e.key
    }
    eq(e: Entry<K, V>) {
        return this.key === e.key
    }
    neq(e: Entry<K, V>) {
        return this.key !== e.key
    }
}

export default Entry
