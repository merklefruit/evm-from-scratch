import { parsers } from "../utils"

import type { MachineState } from "../../machine-state/types"

// 0x30
export function ADDRESS(ms: MachineState) {
  const res = ms.txData.to
  ms.stack.push(parsers.HexStringIntoBigInt(res))
}

// 0x31
export function BALANCE(ms: MachineState) {
  const address = ms.stack.pop()
  const addressHex = parsers.BigintIntoHexString(address)
  const res = ms.globalState.getBalance(addressHex)
  ms.stack.push(res)
}

// 0x32
export function ORIGIN(ms: MachineState) {
  const res = ms.txData.origin
  ms.stack.push(parsers.HexStringIntoBigInt(res))
}

// 0x33
export function CALLER(ms: MachineState) {
  const res = ms.txData.from
  ms.stack.push(parsers.HexStringIntoBigInt(res))
}

// 0x34
export function CALLVALUE(ms: MachineState) {
  const res = ms.txData.value
  ms.stack.push(res)
}

// 0x35
export function CALLDATALOAD(ms: MachineState) {
  const offset = Number(ms.stack.pop())
  const calldataWord = ms.txData.data.subarray(offset, offset + 32)

  const calldataWordPadded = Buffer.alloc(32)
  calldataWord.copy(calldataWordPadded, 0, 0)

  const res = parsers.BytesIntoBigInt(calldataWordPadded)
  ms.stack.push(res)
}

// 0x36
export function CALLDATASIZE(ms: MachineState) {
  const res = ms.txData.data.length
  ms.stack.push(BigInt(res))
}

// 0x37
export function CALLDATACOPY(ms: MachineState) {
  const memOffset = Number(ms.stack.pop())
  const dataOffset = Number(ms.stack.pop())
  const size = Number(ms.stack.pop())

  const data = ms.txData.data.subarray(dataOffset, dataOffset + size)
  ms.memory.write(memOffset, data, size)
}

// 0x38
export function CODESIZE(ms: MachineState) {
  const res = ms.code.length
  ms.stack.push(BigInt(res))
}

// 0x39
export function CODECOPY(ms: MachineState) {
  const memOffset = Number(ms.stack.pop())
  const codeOffset = Number(ms.stack.pop())
  const size = Number(ms.stack.pop())

  const codeBytesPortion = ms.code.subarray(codeOffset, codeOffset + size)
  const codeBuffer = Buffer.from(codeBytesPortion)

  const code = Buffer.alloc(size)
  codeBuffer.copy(code, 0, 0)

  ms.memory.write(memOffset, code, size)
}

// 0x3a
export function GASPRICE(ms: MachineState) {
  const res = ms.txData.gasprice
  ms.stack.push(res)
}

// 0x3b
export function EXTCODESIZE(ms: MachineState) {
  const address = ms.stack.pop()
  const addressHex = parsers.BigintIntoHexString(address)
  const extAccount = ms.globalState?.getAccount(addressHex)
  const res = extAccount?.code?.length ?? 0
  ms.stack.push(BigInt(res))
}

// 0x3c
export function EXTCODECOPY(ms: MachineState) {
  const address = ms.stack.pop()
  const addressHex = parsers.BigintIntoHexString(address)
  const extAccount = ms.globalState?.getAccount(addressHex)

  const memOffset = Number(ms.stack.pop())
  const codeOffset = Number(ms.stack.pop())
  const size = Number(ms.stack.pop())

  const codeBytesPortion = extAccount?.code?.subarray(codeOffset, codeOffset + size)
  const codeBuffer = Buffer.from(codeBytesPortion ?? Buffer.alloc(0))

  const code = Buffer.alloc(size)
  codeBuffer.copy(code, 0, 0)

  ms.memory.write(memOffset, code, size)
}

// 0x3d
export function RETURNDATASIZE(ms: MachineState) {
  const res = BigInt(ms.returnData.length)
  ms.stack.push(res)
}

// 0x3e
export function RETURNDATACOPY(ms: MachineState) {
  const memOffset = Number(ms.stack.pop())
  const returnDataOffset = Number(ms.stack.pop())
  const size = Number(ms.stack.pop())

  const returnData = ms.returnData.subarray(returnDataOffset, returnDataOffset + size)
  ms.memory.write(memOffset, returnData, size)
}

// todo: 0x3f

// 0x47
export function SELFBALANCE(ms: MachineState) {
  const res = ms.globalState.getBalance(ms.txData.to)
  ms.stack.push(res)
}

// todo: 0x48
