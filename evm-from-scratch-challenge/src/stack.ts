// From the yellow paper:
// The EVM is a simple stack-based architecture.
// The word size of the machine (and thus size of stack items) is 256-bit.
// This was chosen to facilitate the Keccak-256 hash scheme and elliptic-curve computations.
// The stack has a maximum size of 1024 elements.

export default class Stack {
  private _stack: bigint[] = []

  push(value: bigint): void {
    if (this._stack.length >= 1024) throw new Error("Stack overflow")

    this._stack.push(value)
  }

  pop(): bigint {
    if (this._stack.length === 0) throw new Error("Stack underflow")
    return this._stack.pop()!
  }

  peek(): bigint {
    return this._stack[this._stack.length - 1]
  }

  get length(): number {
    return this._stack.length
  }

  // todo: add helper functions like swap, dup, pushN, popN
}
