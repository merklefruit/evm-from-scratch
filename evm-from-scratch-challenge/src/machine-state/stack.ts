import { MAX_256_BITS } from "../constants"
import ERRORS from "../errors"

// From the yellow paper:
// The EVM is a simple stack-based architecture.
// The word size of the machine (and thus size of stack items) is 256-bit.
// This was chosen to facilitate the Keccak-256 hash scheme and elliptic-curve computations.
// The stack has a maximum size of 1024 elements.

// Put simply, it is a 1024-long array of 256-bit words.
// Initially I implemented this with a bigint array,
// but I realized it's way simpler to use a js bigint array instead
// because I save a lot of time converting between hex strings, numbers and bigints
// and I don't have to worry about endianness.

const EMPTY_STACK = 0
const FULL_STACK = 1024

export default class Stack {
  protected _stack: bigint[]

  constructor() {
    this._stack = []
  }

  push(value: bigint) {
    if (value < 0n) throw new Error(ERRORS.STACK_VALUE_TOO_SMALL)
    if (value > MAX_256_BITS) throw new Error(ERRORS.STACK_VALUE_TOO_BIG)
    if (this._stack.length === FULL_STACK) throw new Error(ERRORS.STACK_OVERFLOW)

    this._stack.push(value)
  }

  pop(): bigint {
    if (this._stack.length === EMPTY_STACK) throw new Error(ERRORS.STACK_UNDERFLOW)

    return this._stack.pop()!
  }

  popN(n: number): bigint[] {
    if (this._stack.length < n) throw new Error(ERRORS.STACK_UNDERFLOW)

    return this._stack.splice(this._stack.length - n, n)
  }

  peek(): bigint {
    if (this._stack.length === EMPTY_STACK) throw new Error(ERRORS.STACK_UNDERFLOW)

    return this._stack[this._stack.length - 1]
  }

  get length(): number {
    return this._stack.length
  }

  get dump(): bigint[] {
    return this._stack.slice().reverse()
  }
}
