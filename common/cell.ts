import { Direction, Status } from './data'

class Cell {
    x: number
    y: number
    status: Status
    incoming: Direction
    outgoing: Direction
}

export default Cell
