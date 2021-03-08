import Vector from './vector'

class Stack<T> extends Vector<T> {
    push(e: T) {
        this.insert(this.size(), e)
    }
    pop() {
        return this.remove(this.size() - 1)
    }
    top() {
        return this.get(this.size() - 1)
    }
}

export default Stack
