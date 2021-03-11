import Dictionary from '../interface/dictionary'

class Skiplist<K, V> implements Dictionary<K, V> {
    size(): number {
        throw new Error('Method not implemented.')
    }
    put(k: K, v: V): boolean {
        throw new Error('Method not implemented.')
    }
    get(k: K): V {
        throw new Error('Method not implemented.')
    }
    remove(k: K): boolean {
        throw new Error('Method not implemented.')
    }
}

export default Skiplist
