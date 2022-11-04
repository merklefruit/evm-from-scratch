import { bigMath } from "../utils"

import type { MachineState } from "../../machine-state/types"

// 0x16
export function AND(ms: MachineState) {
  const [a, b] = ms.stack.popN(2)
  const res = a & b
  ms.stack.push(res)
}

// 0x17
export function OR(ms: MachineState) {
  const [a, b] = ms.stack.popN(2)
  const res = a | b
  ms.stack.push(res)
}

// 0x18
export function XOR(ms: MachineState) {
  const [a, b] = ms.stack.popN(2)
  const res = a ^ b
  ms.stack.push(res)
}

// 0x19
export function NOT(ms: MachineState) {
  const a = ms.stack.pop()
  const res = bigMath.mod256(~a)
  ms.stack.push(res)
}

// 0x1a
export function BYTE(ms: MachineState) {
  const [pos, val] = ms.stack.popN(2)
  const res = pos > 31n ? 0n : (val >> (8n * (31n - pos))) & 0xffn
  ms.stack.push(res)
}

// todo: 1b, 1c, 1d
