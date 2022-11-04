import { bigMath } from "../utils"

import type { MachineState } from "../../machine-state/types"

// 0x10
export function LT(ms: MachineState) {
  const [a, b] = ms.stack.popN(2)
  const res = a < b ? 1n : 0n
  ms.stack.push(res)
}

// 0x11
export function GT(ms: MachineState) {
  const [a, b] = ms.stack.popN(2)
  const res = a > b ? 1n : 0n
  ms.stack.push(res)
}

// 0x12
export function SLT(ms: MachineState) {
  const [a, b] = ms.stack.popN(2)
  const res = bigMath.toSigned256(a) < bigMath.toSigned256(b) ? 1n : 0n
  ms.stack.push(res)
}

// 0x13
export function SGT(ms: MachineState) {
  const [a, b] = ms.stack.popN(2)
  const res = bigMath.toSigned256(a) > bigMath.toSigned256(b) ? 1n : 0n
  ms.stack.push(res)
}

// 0x14
export function EQ(ms: MachineState) {
  const [a, b] = ms.stack.popN(2)
  const res = a === b ? 1n : 0n
  ms.stack.push(res)
}

// 0x15
export function ISZERO(ms: MachineState) {
  const a = ms.stack.pop()
  const res = a === 0n ? 1n : 0n
  ms.stack.push(res)
}
