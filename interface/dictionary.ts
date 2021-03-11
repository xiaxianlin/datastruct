interface Dictionary<K, V> {
    size(): number
    put(k: K, v: V): boolean
    get(k: K): V
    remove(k: K): boolean
}

export default Dictionary
