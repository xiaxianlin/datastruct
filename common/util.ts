import Stack from '../struct/stack'

export function rand(min: number, max: number) {
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
