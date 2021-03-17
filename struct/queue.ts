import List from './list'

class Queue<T> extends List<T> {
    enqueue(e: T) {
        this.insertAsLast(e)
    }
    dequeue() {
        return this.remove(this.first())
    }
    front() {
        return this.first().data
    }
}

export default Queue
