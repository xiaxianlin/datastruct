/**
 * Fibonacci数列类
 */
class Fib {
    private f: number // f = fib(k - 1)
    private g: number // g = fib(k)

    // 初始化为不小于n的最小Fibonacci项
    constructor(n: number) {
        this.f = 1
        this.g = 0
        while (this.g < n) this.next() // fib(-1), fib(0), O(log_phi(n)时间)
    }
    // 获取当前Fibonacci项，O(1)时间
    get() {
        return this.g
    }
    // 转至下一Fibonacci项，O(1)时间
    next() {
        this.g += this.f
        this.f = this.g - this.f
        return this.g
    }
    // 转至上一Fibonacci项，O(1)时间
    prev() {
        this.f = this.g - this.f
        this.g -= this.f
        return this.g
    }
}

export default Fib
