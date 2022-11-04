import { bigMath } from "../utils"

import type { MachineState } from "../../machine-state/types"

// 0x01
export function ADD(ms: MachineState) {
  const [a, b] = ms.stack.popN(2)
  const res = bigMath.mod256(a + b)
  ms.stack.push(res)
}

// 0x02
export function MUL(ms: MachineState) {
  const [a, b] = ms.stack.popN(2)
  const res = bigMath.mod256(a * b)
  ms.stack.push(res)
}

// 0x03
export function SUB(ms: MachineState) {
  const [a, b] = ms.stack.popN(2)
  const res = bigMath.mod256(a - b)
  ms.stack.push(res)
}

// 0x04
export function DIV(ms: MachineState) {
  const [a, b] = ms.stack.popN(2)
  const res = b === 0n ? 0n : bigMath.mod256(a / b)
  ms.stack.push(res)
}

// 0x05
export function SDIV(ms: MachineState) {
  const [a, b] = ms.stack.popN(2)
  const div = b === 0n ? 0n : bigMath.toSigned256(a) / bigMath.toSigned256(b)
  const res = bigMath.toUnsigned256(div)
  ms.stack.push(res)
}

// 0x06
export function MOD(ms: MachineState) {
  const [a, b] = ms.stack.popN(2)
  const res = b === 0n ? 0n : bigMath.mod256(a % b)
  ms.stack.push(res)
}

// 0x07
export function SMOD(ms: MachineState) {
  const [a, b] = ms.stack.popN(2)
  const mod = b === 0n ? 0n : bigMath.toSigned256(a) % bigMath.toSigned256(b)
  const res = bigMath.toUnsigned256(mod)
  ms.stack.push(res)
}

// TODO: addmod, mulmod, exp, signextend
