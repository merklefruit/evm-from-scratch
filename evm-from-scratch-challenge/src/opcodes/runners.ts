import ERRORS from "../errors"

import type { MachineState } from "../machine-state/types"
import type { Runners } from "./types"

// 0x00
function STOP(ms: MachineState) {
  throw new Error(ERRORS.STOP)
}

// 0x01
function ADD(ms: MachineState) {
  const [a, b] = ms.stack.popN(2)
  ms.stack.push(a + b)
}

// 0x02
function MUL(ms: MachineState) {
  const [a, b] = ms.stack.popN(2)
  ms.stack.push(a * b)
}

// 0x50
function POP(ms: MachineState) {
  ms.stack.pop()
}

// 0x60
function PUSH1(ms: MachineState) {
  if (ms.pc + 1 >= ms.code.length) throw new Error(ERRORS.PC_OUT_OF_BOUNDS)

  const value = ms.code[ms.pc + 1]

  ms.pc += 1
  ms.stack.push(BigInt(value))
}

const runners: Runners = {
  0x00: { name: "STOP", runner: STOP },
  0x01: { name: "ADD", runner: ADD },
  0x02: { name: "MUL", runner: MUL },

  0x50: { name: "POP", runner: POP },

  0x60: { name: "PUSH1", runner: PUSH1 },
}

export default runners
