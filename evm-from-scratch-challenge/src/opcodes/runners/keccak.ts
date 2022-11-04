import { keccak256 } from "ethereum-cryptography/keccak"
import { parsers } from "../utils"

import type { MachineState } from "../../machine-state/types"

// 0x20
export function SHA3(ms: MachineState) {
  const [offset, size] = ms.stack.popN(2)
  const data = ms.memory.read(Number(offset), 32).subarray(0, Number(size))
  const hash = keccak256(data)
  const res = parsers.BytesIntoBigInt(hash)
  ms.stack.push(res)
}
