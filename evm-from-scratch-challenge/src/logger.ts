import fs from "fs"
import path from "path"

import runners from "./opcodes/runners"

import type { MachineState } from "./machine-state/types"
import { parsers } from "./opcodes/utils"

export default class Logger {
  private _output: string[]
  private _steps: number

  constructor() {
    this._steps = 0
    this._output = []
  }

  start(bin: Uint8Array, asm?: string) {
    this._output.push(`******************** Starting Execution ********************`)
    this._output.push(``)
    this._output.push(`Execution Bytecode:`)
    this._output.push(`${Buffer.from(bin).toString("hex")}`)
    this._output.push(``)

    if (asm) {
      this._output.push(`Execution ASM:`)
      this._output.push(asm)
      this._output.push(``)
    }

    this._output.push(`Starting execution...`)
    this._output.push(``)
  }

  step(ms: MachineState) {
    this._output.push(`******************** Step ${this._steps++} ********************`)
    this._output.push(`Opcode: ${runners[ms.code[ms.pc]].name}`)
    this._output.push(`Program Counter: ${ms.pc}`)
    this._output.push(``)
    this._output.push(`Stack:`)
    this._output.push(`${ms.stack.dump.map(parsers.BigintIntoHexString).join("\n")}`)
    this._output.push(``)
    this._output.push(`Memory:`)
    this._output.push(`${ms.memory.dump || "Empty"}`)
    this._output.push(``)
    this._output.push(`Storage:`)
    this._output.push(`${ms.storage.dump || "Empty"}`)
    this._output.push(``)
    this._output.push(`Return data:`)
    this._output.push(`${ms.returnData.toString("hex") || "Empty"}`)
    this._output.push(``)
    this._output.push(`Logs:`)
    this._output.push(`${ms.logs || "Empty"}`)
    this._output.push(``)
  }

  error(err: string) {
    this._output.push(`******************** ERROR ********************`)
    this._output.push(``)
    this._output.push(`Runtime Error encountered: ${err}`)
    this._output.push(``)
  }

  notify(message: string) {
    this._output.push(`******************** NOTIFICATION ********************`)
    this._output.push(``)
    this._output.push(`${message}`)
    this._output.push(``)
  }

  get output() {
    return this._output.join("\n")
  }

  saveToFile(filename?: string): string {
    try {
      if (!filename) filename = `execution-${Date.now()}`

      if (!fs.existsSync(path.join(__dirname, "../logs")))
        fs.mkdirSync(path.join(__dirname, "../logs"))

      const filepath = path.join(__dirname, `../logs/${filename}.log`)
      fs.writeFileSync(filepath, this.output)
      return filepath
    } catch (err) {
      console.error("Error while saving logs to file: ", err)
      return ""
    }
  }
}
