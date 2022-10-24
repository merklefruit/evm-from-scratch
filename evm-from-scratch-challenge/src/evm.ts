import Memory from "./machine-state/memory"
import Stack from "./machine-state/stack"
import Storage from "./machine-state/storage"
import runners from "./opcodes/runners"
import ERRORS from "./errors"

import type { MachineState } from "./machine-state/types"

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
  private _ms: MachineState
  private _storage: Storage

  constructor(_code: Uint8Array) {
    this._storage = new Storage()

    this._ms = {
      gasAvailable: 0n, // todo
      activeWordsInMemory: 0n, // todo
      memory: new Memory(),
      stack: new Stack(),
      code: _code,
      pc: 0,
    }
  }

  public async run() {
    let success = false

    // execute opcodes sequentially
    console.log("starting execution")
    console.log("code", this._ms.code)
    console.log("pc", this._ms.pc)

    while (this._ms.pc < this._ms.code.length) {
      const opcode = this.currentOpcode

      try {
        await this.execute(opcode)
      } catch (err: any) {
        console.log("Encountered runtime error:", err.message)
        if (err.message === ERRORS.STOP) success = true
        break
      }
    }

    const result = { success, stack: this._ms.stack.dump }

    return result
  }

  // Execute a single opcode and update the machine state
  private async execute(opcode: number): Promise<void> {
    console.log(`executing 0x${opcode.toString(16)}: ${runners[opcode]?.name}`)

    const runner = runners[opcode]?.runner
    if (!runner) throw new Error(`Opcode 0x${opcode.toString(16)} not implemented`)

    // execute the opcode
    console.log("stack before", this._ms.stack.dump)
    await runner(this._ms)
    console.log("stack after", this._ms.stack.dump)

    this._ms.pc++
  }

  get currentOpcode(): number {
    if (this._ms.pc >= this._ms.code.length) throw new Error(ERRORS.PC_OUT_OF_BOUNDS)

    return this._ms.code[this._ms.pc]
  }
}
