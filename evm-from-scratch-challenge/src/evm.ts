export default class EVM {
  private _stack: bigint[] = []
  private _memory: Uint8Array = new Uint8Array(0)
  private _storage: Map<BigInt, BigInt> = new Map()
  private _pc: number = 0

  public async run(code: Uint8Array) {
    const pc = 0

    while (pc < code.length) {
      const opcode = code[pc]

      try {
        await this.execute(opcode)
      } catch (err: any) {
        throw new Error(`Error executing opcode ${opcode} at pc ${pc}: ${err.message}`)
      }
      break
    }

    return { stack: [] }
  }

  // Execute a single opcode and update the stack
  private async execute(opcode: number): Promise<void> {
    if (opcode === 0x01) {
      this._stack.push(1n)
    } else {
      throw new Error(`Unknown opcode ${opcode}`)
    }
  }
}
