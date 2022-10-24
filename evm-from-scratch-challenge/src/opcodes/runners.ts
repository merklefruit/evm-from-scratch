import { bigMath, buildOpcodeRangeObjects, parseBytesIntoBigInt } from "./utils"
import ERRORS from "../errors"

import type { MachineState } from "../machine-state/types"
import type { Runners } from "./types"

// 0x00
function STOP() {
  throw new Error(ERRORS.STOP)
}

// 0x01
function ADD(ms: MachineState) {
  const [a, b] = ms.stack.popN(2)
  const res = bigMath.mod256(a + b)
  ms.stack.push(res)
}

// 0x02
function MUL(ms: MachineState) {
  const [a, b] = ms.stack.popN(2)
  const res = bigMath.mod256(a * b)
  ms.stack.push(res)
}

// 0x03
function SUB(ms: MachineState) {
  const [a, b] = ms.stack.popN(2)
  const res = bigMath.mod256(a - b)
  ms.stack.push(res)
}

// 0x04
function DIV(ms: MachineState) {
  const [a, b] = ms.stack.popN(2)
  const res = b === 0n ? 0n : bigMath.mod256(a / b)
  ms.stack.push(res)
}

// 0x05
function SDIV(ms: MachineState) {
  const [a, b] = ms.stack.popN(2)
  const div = b === 0n ? 0n : bigMath.toSigned256(a) / bigMath.toSigned256(b)
  const res = bigMath.toUnsigned256(div)
  ms.stack.push(res)
}

// 0x06
function MOD(ms: MachineState) {
  const [a, b] = ms.stack.popN(2)
  const res = b === 0n ? 0n : bigMath.mod256(a % b)
  ms.stack.push(res)
}

// 0x07
function SMOD(ms: MachineState) {
  const [a, b] = ms.stack.popN(2)
  const mod = b === 0n ? 0n : bigMath.toSigned256(a) % bigMath.toSigned256(b)
  const res = bigMath.toUnsigned256(mod)
  ms.stack.push(res)
}

// TODO: addmod, mulmod, exp, signextend

// 0x10
function LT(ms: MachineState) {
  const [a, b] = ms.stack.popN(2)
  const res = a < b ? 1n : 0n
  ms.stack.push(res)
}

// 0x11
function GT(ms: MachineState) {
  const [a, b] = ms.stack.popN(2)
  const res = a > b ? 1n : 0n
  ms.stack.push(res)
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
  0x04: { name: "DIV", runner: DIV },
  0x05: { name: "SDIV", runner: SDIV },
  0x06: { name: "MOD", runner: MOD },
  0x07: { name: "SMOD", runner: SMOD },

  0x10: { name: "LT", runner: LT },
  0x11: { name: "GT", runner: GT },

  ...buildOpcodeRangeObjects(0x50, 0x5f, "POP", POP),
  ...buildOpcodeRangeObjects(0x60, 0x7f, "PUSH", PUSH),
}

export default runners
