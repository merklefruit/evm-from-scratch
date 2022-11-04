import { parsers } from "../utils"

import type { MachineState } from "../../machine-state/types"

// todo: 0x40

// 0x41
export function COINBASE(ms: MachineState) {
  const res = ms.block.coinbase
  ms.stack.push(parsers.HexStringIntoBigInt(res))
}

// 0x42
export function TIMESTAMP(ms: MachineState) {
  const res = ms.block.timestamp
  ms.stack.push(res)
}

// 0x43
export function NUMBER(ms: MachineState) {
  const res = ms.block.number
  ms.stack.push(BigInt(res))
}

// 0x44
export function DIFFICULTY(ms: MachineState) {
  const res = ms.block.difficulty
  ms.stack.push(BigInt(res))
}

// 0x45
export function GASLIMIT(ms: MachineState) {
  const res = ms.block.gaslimit
  ms.stack.push(parsers.HexStringIntoBigInt(res))
}

// 0x46
export function CHAINID(ms: MachineState) {
  const res = ms.block.chainid
  ms.stack.push(BigInt(res))
}
