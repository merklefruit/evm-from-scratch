import ERRORS from "../errors"
import { bigMath, buildOpcodeRangeObjects, parseBytesIntoBigInt } from "./utils"
import { MAX_256_BITS } from "../constants"

import type { MachineState } from "../machine-state/types"
import type { Runners } from "./types"

// 0x00
function STOP() {
  throw new Error(ERRORS.STOP)
}

// 0x01
function ADD(ms: MachineState) {
  const [a, b] = ms.stack.popN(2)

  ms.stack.push((a + b) % MAX_256_BITS)
}

// 0x02
function MUL(ms: MachineState) {
  const [a, b] = ms.stack.popN(2)
  ms.stack.push((a * b) % MAX_256_BITS)
}

// 0x03
function SUB(ms: MachineState) {
  const [a, b] = ms.stack.popN(2)
  ms.stack.push(b < a ? MAX_256_BITS + b - a : b - a)
}

// 0x50 - 0x5f
function POP(ms: MachineState) {
  const size = ms.code[ms.pc] - 0x4f
  ms.stack.popN(size)
}

// 0x60 - 0x7f
function PUSH(ms: MachineState) {
  const size = ms.code[ms.pc] - 0x5f
  if (ms.pc + size >= ms.code.length) throw new Error(ERRORS.PC_OUT_OF_BOUNDS)

  const value = ms.code.slice(ms.pc + 1, ms.pc + size + 1)
  const valueAsBigInt = parseBytesIntoBigInt(value)

  ms.pc += size
  ms.stack.push(valueAsBigInt)
}

// ******************************* RUNNERS OBJECT *******************************

const runners: Runners = {
  0x00: { name: "STOP", runner: STOP },
  0x01: { name: "ADD", runner: ADD },
  0x02: { name: "MUL", runner: MUL },
  0x03: { name: "SUB", runner: SUB },

  ...buildOpcodeRangeObjects(0x50, 0x5f, "POP", POP),
  ...buildOpcodeRangeObjects(0x60, 0x7f, "PUSH", PUSH),
}

export default runners
