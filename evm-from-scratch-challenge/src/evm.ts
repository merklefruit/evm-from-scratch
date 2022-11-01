import { buildBlock, buildState, buildTxData } from "./utils"
import { MAX_256_BITS } from "./constants"
import runners from "./opcodes/runners"
import ERRORS from "./errors"

import GlobalState from "./globalState"
import Logger from "./logger"

import Stack from "./machine-state/stack"
import Memory from "./machine-state/memory"
import Storage from "./machine-state/storage"

import type { Address, EvmParams } from "./types"
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
  private _origin: Address
  private _gasPrice: bigint
  private _gasLimit: bigint
  private _ms: MachineState

  public logger: Logger
  public readonly debug: boolean
  public readonly saveLogs: boolean

  constructor(params: Partial<EvmParams>) {
    if (!params._code) throw new Error(ERRORS.NO_CODE_PROVIDED)

    // build default state objects if not provided in params
    if (!params._globalState) params._globalState = buildState()
    if (!params._txData) params._txData = buildTxData()
    if (!params._block) params._block = buildBlock()

    this.debug = params.debug ?? false
    this.saveLogs = params.saveLogs ?? false
    this.logger = new Logger(params._code, params._asm)
    this._origin = params._txData?.origin
    this._gasPrice = 0n
    this._gasLimit = 0n

    this._ms = {
      globalState: new GlobalState(params._globalState),
      storage: new Storage(),
      memory: new Memory(),
      stack: new Stack(),
      returnData: Buffer.alloc(0),
      gasAvailable: MAX_256_BITS - 1n, // todo
      txData: params._txData,
      block: params._block,
      code: params._code,
      logs: [],
      pc: 0,
    }
  }

  public async run() {
    let success = false
    let logsFile = ""

    // execute opcodes sequentially
    while (this._ms.pc < this._ms.code.length) {
      try {
        await this.execute(this.currentOpcode)
      } catch (err: any) {
        this.logger.error(err)
        if (err.message === ERRORS.STOP) success = true
        break
      }
    }

    if (this.debug) console.log(this.logger.output)
    if (this.saveLogs) logsFile = this.logger.saveToFile()

    const result = {
      success,
      stack: this._ms.stack.dump,
      return: this._ms.returnData.toString("hex"),
      logs: this._ms.logs,
      logsFile,
    }

    return result
  }

  // Execute a single opcode and update the machine state
  private async execute(opcode: number): Promise<void> {
    const runner = runners[opcode]?.runner
    if (!runner) throw new Error(ERRORS.OPCODE_NOT_IMPLEMENTED)

    this.logger.step(this._ms)
    await runner(this._ms)

    this._ms.pc++
  }

  get currentOpcode(): number {
    if (this._ms.pc >= this._ms.code.length) throw new Error(ERRORS.PC_OUT_OF_BOUNDS)

    return this._ms.code[this._ms.pc]
  }
}
