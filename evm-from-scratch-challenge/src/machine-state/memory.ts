// From the yellow paper:
// The memory model is a simple word-addressed byte array.
// The word size is 256 bits (32 bytes).
// The memory is expanded by a word (32 bytes) at a time.
// The memory size is always a multiple of 32 bytes.
// The memory starts empty at the beginning of every instance execution.

// Javascript uses Buffers to represent a sequence of bytes.

export default class Memory {
  private _memory: Buffer

  constructor() {
    this._memory = Buffer.alloc(0)
  }

  write(offset: bigint, value: Buffer) {
    const newLength = Number(offset) + value.length

    if (newLength > this._memory.length) {
      this._memory = Buffer.concat([
        this._memory,
        Buffer.alloc(newLength - this._memory.length),
      ])
    }

    this._memory.set(value, Number(offset))
  }

  read(offset: bigint, length: bigint): Buffer {
    const result = Buffer.alloc(Number(length))
    this._memory.copy(result, 0, Number(offset), Number(offset) + Number(length))
    return result
  }
}
