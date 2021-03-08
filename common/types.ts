export type Rank = number

export enum RBColor {
    NONE,
    RB_RED,
    RB_BLACK
}

export type VST<T> = (e: T) => void
