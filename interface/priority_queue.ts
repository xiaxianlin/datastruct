interface IPriorityQueue<T> {
    insert(e: T): void
    getMax(): T
    delMax(): T
}

export default IPriorityQueue
