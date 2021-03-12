import BinTree, { BinNode } from '../struct/binary_tree'
import Entry from '../struct/entry'
import Queue from '../struct/queue'
import Stack from '../struct/stack'

export function rand(min: number, max?: number) {
    if (typeof max === 'undefined') {
        min = 0
        max = min
    }
    if (min > max) {
        throw 'min must less then max'
    }
    return Math.floor(Math.random() * max - min + 1 + min)
}

export function isdigit(s: string) {
    return /^[0-9]{1}$/.test(s)
}

export function readNumber(S: string, opnd: Stack<number>) {
    let n = '',
        i = 0
    while (isdigit(S.charAt(i))) n += S.charAt(i++)
    opnd.push(Number(n))
    return S.slice(i)
}

export function calcu(op: string, n1: number, n2?: number) {
    switch (op) {
        case '!':
            let r = n1
            for (let i = n1 - 1; i > 0; i--) r *= i
            return r
        case '^':
            return Math.pow(n1, n2)
        case '+':
            return n1 + n2
        case '-':
            return n1 - n2
        case '*':
            return n1 * n2
        case '/':
            return Math.floor(n1 / n2)
        default:
            return null
    }
}

export function compare<K, V, T>(a: T | Entry<K, V>, b: T | Entry<K, V>, op: string) {
    let isEntry = a instanceof Entry && b instanceof Entry
    switch (op) {
        case '>':
            return isEntry ? (a as Entry<K, V>).gt(b as Entry<K, V>) : a > b
        case '<':
            return isEntry ? (a as Entry<K, V>).lt(b as Entry<K, V>) : a < b
        case '>=':
            return isEntry ? (a as Entry<K, V>).gte(b as Entry<K, V>) : a >= b
        case '<=':
            return isEntry ? (a as Entry<K, V>).lte(b as Entry<K, V>) : a <= b
        case '===':
            return isEntry ? (a as Entry<K, V>).eq(b as Entry<K, V>) : a === b
        case '!==':
            return isEntry ? (a as Entry<K, V>).neq(b as Entry<K, V>) : a !== b
    }
}

export function swap<T>(arr: T[], i: number, j: number) {
    let t = arr[i]
    arr[i] = arr[j]
    arr[j] = t
}

export function max(arr: number[]) {
    let max = arr[0]
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] > max) max = arr[i]
    }
    return max
}

function arrayFill(n: number, s: string) {
    let a = []
    while (-1 < n) a[--n] = s
    return a
}

export function printBinTree<T>(x: BinNode<T>, closed: boolean = false) {
    if (!x || closed) return
    let Q = new Queue<BinNode<T>>() // 辅助队列
    Q.enqueue(x) // 根节点入队
    let data = []
    let level = 0
    while (!Q.empty()) {
        x = Q.dequeue() // 拿出父节点
        level = x.level = x.parent ? x.parent.level + 1 : 0
        data[x.level] = data[x.level] || []
        if (x.isLChild()) {
            x.position = 2 * x.parent.position
        } else if (x.isRChild()) {
            x.position = 2 * x.parent.position + 1
        }
        data[x.level].push(x)
        if (x.lc) Q.enqueue(x.lc) // 左子节点入队
        if (x.rc) Q.enqueue(x.rc) // 右子节点入队
    }
    let len = 1 * Math.pow(2, level + 1)
    let info = data.reduce((info: string, items: BinNode<T>[], index: number) => {
        let tmp = arrayFill(len, '_')
        let thunk = Math.ceil(len / Math.pow(2, index + 1))
        items.forEach((item: BinNode<T>) => {
            tmp[thunk * item.position * 2 + thunk] = item.data
        })
        return info + tmp.join('') + '\n'
    }, '')
    console.log(info)
}
