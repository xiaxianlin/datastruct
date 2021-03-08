import Stack from '../struct/stack'
import Cell from '../common/cell'
import Queen from '../common/queen'
import { digit, Direction, operators, priority, Status } from '../common/data'
import { nextDirection, neighbor, advance } from '../utils/laby'
import { calcu, isdigit, readNumber } from '../common/util'

/**
 * 十进制数字转成d进制
 * @param n 数字，十进制
 * @param d 进制数，2~16
 */
export function convert(n: number, d: number) {
    let S = new Stack<string>()
    while (n > 0) {
        S.push(digit[n % d])
        n = Math.floor(n / d)
    }
    let res: string = ''
    while (!S.empty()) res += S.pop()
    return res
}

/**
 * 检查表达式的括号是否正确
 * @param exp 表达式字符串
 * @param lo 开始位置
 * @param hi 结束位置
 */
export function paren(exp: string, lo: number, hi: number) {
    let S = new Stack()
    for (let i = lo; i <= hi; i++) {
        switch (exp[i]) {
            case '(':
            case '[':
            case '{':
                S.push(exp[i])
                break
            case ')':
                if (S.empty() || '(' !== S.pop()) return false
                break
            case ']':
                if (S.empty() || '[' !== S.pop()) return false
                break
            case '}':
                if (S.empty() || '[' !== S.pop()) return false
                break
        }
    }
    return S.empty()
}

function orderBetween(topOptr: string, curOptr: string) {
    let i1 = operators.indexOf(topOptr),
        i2 = operators.indexOf(curOptr)
    return priority[i1][i2]
}

export function evaluate(S: string, RPN: string[]) {
    let opnd = new Stack<number>() // 运算数栈
    let optr = new Stack<string>() // 运算符栈
    // 手动添加结束符
    S += '\0'
    optr.push('\0')

    while (!optr.empty()) {
        // 当前字符为操作数
        if (isdigit(S.charAt(0))) {
            // 读出操作数，并返回新的字符串
            S = readNumber(S, opnd)
            // 将操作数接到RPN末尾
            RPN.push(opnd.top().toString())
        } else {
            // 视其与栈顶运算符之间优先级高地分别处理
            let p = orderBetween(optr.top(), S.charAt(0))
            switch (p) {
                case '<': // 栈顶运算符优先级更低，推迟计算，当前运算符进栈
                    optr.push(S.charAt(0))
                    S = S.slice(1)
                    break
                case '=': // 优先级相等，脱括号并接受下一个字符
                    optr.pop()
                    S = S.slice(1)
                    break
                case '>': // 栈顶运算符优先级更高时，可实施相应的计算，并将结果入栈
                    // 栈顶运算符出栈并续接至RPN末尾
                    let op = optr.pop()
                    RPN.push(op.toString())
                    // 若属一元运算符
                    if ('!' === op) {
                        opnd.push(calcu(op, opnd.pop()))
                    } else {
                        // 取出后、前操作数
                        let pOpnd2 = opnd.pop(),
                            pOpnd1 = opnd.pop()
                        // 计算结构并入栈
                        opnd.push(calcu(op, pOpnd1, pOpnd2))
                    }
                    break
                default:
                    throw 'syntax error'
            }
        }
    }
    return opnd.pop()
}

// 对比皇后，如果与栈里面有冲突则返回true，否则返回false
function compareQueens(solu: Stack<Queen>, q: Queen) {
    for (let i = 0; i < solu.size(); i++) {
        if (solu.get(i).equal(q)) return true
    }
    return false
}

export function placeQueens(N: number, x: number = 0, y: number = 0) {
    let solu = new Stack<Queen>()
    // 从原点出发
    let q = new Queen(x, y)
    // 反复试探、回溯
    do {
        // 若出界
        if (N <= solu.size() || N <= q.x) {
            // 回溯一行，并继续尝试下一列
            q = solu.pop()
            q.x++
        } else {
            // 通过与已有皇后的对比
            while (q.x < N && compareQueens(solu, q)) {
                q.x++
            }
            // 若存在可摆放的列
            if (N > q.x) {
                // 摆上当前皇后
                solu.push(q)
                // 转入下一行，从0列开始，试探下一个皇后
                q = new Queen(0, q.y + 1)
            }
        }
    } while (0 < q.x || q.y < N)
    return solu
}

export function labyrinth(Laby: Cell[][], s: Cell, t: Cell) {
    // 用栈记录通道
    let path = new Stack<Cell>()
    if (s.status !== Status.AVAILABLE || t.status !== Status.AVAILABLE) return path
    // 起点
    s.incoming = Direction.UNKONWN
    s.status = Status.ROUTE
    path.push(s)
    // 从起点出发不断试探、回溯，直到抵达终点，或者穷尽所有可能
    do {
        let c = path.top() // 检查当前位置
        if (c === t) return path // 若已抵达终点，则找到了一条通路，否则，沿未试探的方向继续试探
        // 逐一检查所有方向
        while (Direction.NO_WAY > (c.outgoing = nextDirection(c.outgoing))) {
            // 试图找到尚未试探的方向
            if (Status.AVAILABLE === neighbor(c, Laby).status) break
        }
        // 若所有方向都已尝试
        if (Direction.NO_WAY <= c.outgoing) {
            // 则向后回溯一步
            c.status = Status.BACKTRACKED
            c = path.pop()
        }
        // 否则，向前试探一步
        else {
            path.push((c = advance(c, Laby)))
            c.outgoing = Direction.UNKONWN
            c.status = Status.ROUTE
        }
    } while (!path.empty())
    return path
}
