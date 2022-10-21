import Memory from "./memory"
import Stack from "./stack"

export default class EVM {
  private _stack: Stack
  private _memory: Memory
  private _storage: Map<BigInt, BigInt> = new Map()
  private _pc: number = 0

  constructor() {
    this._stack = new Stack()
    this._memory = new Memory()
  }

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

    const result = { stack: this._stack }

    return result
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
