import ERRORS from "../../errors"

import type { MachineState } from "../../machine-state/types"

// 0x00
export function STOP() {
  throw new Error(ERRORS.STOP)
}

// 0x56
export function JUMP(ms: MachineState) {
  const dest = ms.stack.pop()
  if (dest > ms.code.length) throw new Error(ERRORS.JUMP_OUT_OF_BOUNDS)
  if (ms.code[Number(dest)] !== 0x5b) throw new Error(ERRORS.JUMP_TO_INVALID_DESTINATION)
  ms.pc = Number(dest)
}

// 0x57
export function JUMPI(ms: MachineState) {
  const [dest, cond] = ms.stack.popN(2)
  if (cond === 0n) return
  if (dest > ms.code.length) throw new Error(ERRORS.JUMP_OUT_OF_BOUNDS)
  if (ms.code[Number(dest)] !== 0x5b) throw new Error(ERRORS.JUMP_TO_INVALID_DESTINATION)
  ms.pc = Number(dest)
}

// 0x58
export function PC(ms: MachineState) {
  ms.stack.push(BigInt(ms.pc))
}

// 0x5a
export function GAS(ms: MachineState) {
  ms.stack.push(ms.gasAvailable)
}

// 0x5b
export function JUMPDEST(ms: MachineState) {
  // do nothing
}
