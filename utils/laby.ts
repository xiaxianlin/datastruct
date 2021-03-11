import Cell from '../common/cell'
import { Direction, Status } from '../common/data'
import { rand } from '../common/util'

// 纵轴为outgoing，横轴为incoming，┌，┐，└，┘
const pattern = [
    /*******0****E****S****W****N**/
    /*0*/ ['+', '+', '+', '+', '+'],
    /*E*/ ['+', ' ', '┌', '─', '└'],
    /*S*/ ['+', '┌', ' ', '┐', '│'],
    /*W*/ ['+', '─', '┐', ' ', '┘'],
    /*N*/ ['+', '└', '│', '┘', ' ']
]

// 下一个方向
export function nextDirection(Direction: Direction): Direction {
    return Direction + 1
}

// 查询当前位置的相邻格点
export function neighbor(cell: Cell, laby: Cell[][]) {
    let { x, y } = cell
    switch (cell.outgoing) {
        case Direction.EAST:
            y++
            break
        case Direction.SOUTH:
            x++
            break
        case Direction.WEST:
            y--
            break
        case Direction.NORTH:
            x--
            break
        default:
            throw 'direction error'
    }
    return laby[x][y]
}

// 从当前位置转入相邻格点
export function advance(cell: Cell, laby: Cell[][]) {
    let next = neighbor(cell, laby)
    switch (cell.outgoing) {
        case Direction.EAST:
            next.incoming = Direction.WEST
            break
        case Direction.SOUTH:
            next.incoming = Direction.NORTH
            break
        case Direction.WEST:
            next.incoming = Direction.EAST
            break
        case Direction.NORTH:
            next.incoming = Direction.SOUTH
            break
        default:
            throw 'direction error'
    }
    return next
}

export function randLaby(max: number): [Cell[][], Cell, Cell] {
    let laby: Cell[][] = []
    let size = max
    for (let i = 0; i < size; i++) {
        laby[i] = []
        for (let j = 0; j < size; j++) {
            let cell = new Cell()
            cell.x = i
            cell.y = j
            cell.incoming = cell.outgoing = Direction.UNKONWN
            cell.status = Status.WALL
            laby[i][j] = cell
        }
    }
    for (let i = 1; i < size - 1; i++) {
        for (let j = 1; j < size - 1; j++) {
            if (rand(4) !== 2) laby[i][j].status = Status.AVAILABLE
        }
    }
    let startCell = laby[rand(size - 2) + 1][rand(size - 2) + 1]
    let goalCell = laby[rand(size - 2) + 1][rand(size - 2) + 1]
    startCell.status = goalCell.status = Status.AVAILABLE
    return [laby, startCell, goalCell]
}

export function displayLaby(laby: Cell[][], startCell: Cell, goalCell: Cell) {
    let size = laby.length
    for (let i = 0; i < size; i++) {
        let line = ''
        for (let j = 0; j < size; j++) {
            let cell = laby[i][j]
            if (goalCell === cell) {
                line += 'S'
            } else if (startCell === cell) {
                line += 'O'
            } else {
                switch (cell.status) {
                    case Status.WALL:
                        line += '█'
                        break
                    case Status.BACKTRACKED:
                    case Status.AVAILABLE:
                        line += ' '
                        break
                    default:
                        line += pattern[cell.outgoing][cell.incoming]
                        break
                }
            }
        }
        console.log(line)
    }
}
