import ERRORS from "../errors"

// From the yellow paper:
// The memory model is a simple word-addressed byte array.
// The word size is 256 bits (32 bytes).
// The memory is expanded by a word (32 bytes) at a time. Memory expansion costs gas.
// The memory size is always a multiple of 32 bytes.
// The memory starts empty at the beginning of every instance execution.

export default class Memory {
  protected _memory: Buffer

  constructor() {
    this._memory = Buffer.alloc(0)
  }

  write(offset: number, value: Buffer, size: 1 | 32 | number) {
    if (offset < 0) throw new Error(ERRORS.INVALID_MEMORY_OFFSET)
    if (value.length !== size) throw new Error(ERRORS.INVALID_MEMORY_VALUE_SIZE)

    const overflow = Math.ceil((offset + size) / 32) * 32 - this.size
    if (overflow) this._memory = Buffer.concat([this._memory, Buffer.alloc(overflow)])

    for (const byte of value) this._memory[offset++] = byte
  }

  read(offset: number, size: number): Buffer {
    if (offset < 0) throw new Error(ERRORS.INVALID_MEMORY_OFFSET)
    if (size === 0) return Buffer.alloc(0)

    const overflow = Math.ceil((offset + size) / 32) * 32 - this.size
    if (!overflow) return this._memory.subarray(offset, offset + size)

    this._memory = Buffer.concat([this._memory, Buffer.alloc(overflow)])

    const output = Buffer.alloc(size)
    this._memory.copy(output, 0, offset)
    return output
  }

  get size(): number {
    return this._memory.length
  }

  get activeWordsCount(): number {
    return this.size / 32
  }

  get dump(): string {
    let dump = ""
    for (let i = 0; i < this._memory.length; i += 32)
      dump += this._memory.subarray(i, i + 32).toString("hex") + "\n"

    return dump
  }
}
