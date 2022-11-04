import { parsers } from "../utils"

import type { MachineState } from "../../machine-state/types"

// 0x54
export function SLOAD(ms: MachineState) {
  const key = ms.stack.pop()
  const keyHex = parsers.BigintIntoHexString(key)
  const val = ms.storage.getAsBigInt(ms.txData.to, keyHex)
  ms.stack.push(val)
}

// 0x55
export function SSTORE(ms: MachineState) {
  const [key, val] = ms.stack.popN(2)
  const keyHex = parsers.BigintIntoHexString(key)
  ms.storage.setAsBigInt(ms.txData.to, keyHex, val)
}
