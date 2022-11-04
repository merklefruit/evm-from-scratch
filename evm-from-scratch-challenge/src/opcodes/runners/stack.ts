import ERRORS from "../../errors"
import { parsers } from "../utils"

import type { MachineState } from "../../machine-state/types"

// 0x50
export function POP(ms: MachineState) {
  ms.stack.pop()
}

// 0x60 - 0x7f
export function PUSH(ms: MachineState) {
  const size = ms.code[ms.pc] - 0x5f
  if (ms.pc + size >= ms.code.length) throw new Error(ERRORS.PC_OUT_OF_BOUNDS)

  const value = ms.code.slice(ms.pc + 1, ms.pc + size + 1)
  const valueAsBigInt = parsers.BytesIntoBigInt(value)

  ms.pc += size
  ms.stack.push(valueAsBigInt)
}

// 0x80 - 0x8f
export function DUP(ms: MachineState) {
  const pos = ms.code[ms.pc] - 0x7f
  const value = ms.stack.peek(pos)
  ms.stack.push(value)
}

// 0x90 - 0x9f
export function SWAP(ms: MachineState) {
  const pos = ms.code[ms.pc] - 0x8f
  ms.stack.swap(pos)
}
