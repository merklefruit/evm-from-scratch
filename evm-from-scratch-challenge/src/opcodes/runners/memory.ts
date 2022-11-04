import { parsers } from "../utils"

import type { MachineState } from "../../machine-state/types"

// 0x51
export function MLOAD(ms: MachineState) {
  const offset = Number(ms.stack.pop())
  const val = parsers.BytesIntoBigInt(ms.memory.read(offset, 32))
  ms.stack.push(val)
}

// 0x52
export function MSTORE(ms: MachineState) {
  const [offset, val] = ms.stack.popN(2)
  const word = parsers.BigIntIntoBytes(val, 32)
  ms.memory.write(Number(offset), word, 32)
}

// 0x53
export function MSTORE8(ms: MachineState) {
  const [offset, val] = ms.stack.popN(2)
  const byte = parsers.BigIntIntoBytes(val, 1)
  ms.memory.write(Number(offset), byte, 1)
}

// 0x59
export function MSIZE(ms: MachineState) {
  ms.stack.push(BigInt(ms.memory.size))
}
