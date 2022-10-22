import Memory from "./machine-state/memory"
import Stack from "./machine-state/stack"
import Storage from "./machine-state/storage"

import runners from "./opcodes/runners"

import type { MachineState } from "./machine-state/types"
import type { ProgramCounter } from "./types"

// Main EVM class. Brainstorming notes:
// For each transaction, the EVM can take as input:
// - the transaction input data (if message call) or the init code (if contract creation)
// - the world state involved with the transaction, such as the account code and storage
// - the transaction context, such as the caller, gas price, and gas limit
// - the block context, such as the block number, timestamp, and gas limit
// - the transaction execution context, such as the transaction nonce, gas price, and gas limit
//
// Then, it can sequentially execute according to the instructions specified
// and return the updated world state and the transaction output data.

export default class EVM {
  private _stack: Stack
  private _memory: Memory
  private _storage: Storage
  private _pc: ProgramCounter
  private _code: Uint8Array

  constructor(code: Uint8Array) {
    this._stack = new Stack()
    this._memory = new Memory()
    this._storage = new Storage()
    this._pc = 0
    this._code = code
  }

  public async run() {
    // program counter is init to 0 and incremented by 1 after each instruction
    const pc = 0

    let success: boolean = false

    // execute opcodes sequentially
    while (pc < this._code.length) {
      const opcode = this._code[pc]

      try {
        console.log("executing opcode: ", opcode.toString(16))
        await this.execute(opcode)
      } catch (err: any) {
        if (err.message === "STOP") break
        else throw new Error(err)
      }
    }

    const result = { stack: this._stack.dump }

    return result
  }

  // Execute a single opcode and update the stack
  private async execute(opcode: number): Promise<void> {
    const runner = runners[opcode]?.runner
    if (!runner) throw new Error(`Opcode ${opcode} not implemented`)

    const state: MachineState = {
      gasAvailable: 0n, // todo
      pc: this._pc,
      memory: this._memory,
      activeWordsInMemory: 0n, // todo
      stack: this._stack,
      code: this._code,
    }

    await runner(state)
    this._pc += 1
  }
}
