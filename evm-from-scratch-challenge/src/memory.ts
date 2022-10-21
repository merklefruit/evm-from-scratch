// From the yellow paper:
// The memory model is a simple word-addressed byte array.
// The word size is 256 bits (32 bytes).
// The memory is expanded by a word (32 bytes) at a time.
// The memory size is always a multiple of 32 bytes.
// The memory starts empty at the beginning of every instance execution.

export default class Memory {
  private _memory: Uint8Array = new Uint8Array(0)

  write(offset: bigint, value: Uint8Array) {
    const newLength = Number(offset) + value.length

    if (newLength > this._memory.length) {
      const newMemory = new Uint8Array(newLength)
      newMemory.set(this._memory)
      this._memory = newMemory
    }

    this._memory.set(value, Number(offset))
  }

  read(offset: bigint, length: bigint): Uint8Array {
    return this._memory.slice(Number(offset), Number(offset) + Number(length))
  }
}
