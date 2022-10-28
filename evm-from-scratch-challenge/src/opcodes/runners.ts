import { keccak256 } from "ethereum-cryptography/keccak"
import ERRORS from "../errors"
import {
  bigMath,
  buildOpcodeRangeObjects,
  parseBigIntIntoBytes,
  parseBigintIntoHexString,
  parseBytesIntoBigInt,
  parseHexStringIntoBigInt,
} from "./utils"

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

// 0x12
function SLT(ms: MachineState) {
  const [a, b] = ms.stack.popN(2)
  const res = bigMath.toSigned256(a) < bigMath.toSigned256(b) ? 1n : 0n
  ms.stack.push(res)
}

// 0x13
function SGT(ms: MachineState) {
  const [a, b] = ms.stack.popN(2)
  const res = bigMath.toSigned256(a) > bigMath.toSigned256(b) ? 1n : 0n
  ms.stack.push(res)
}

// 0x14
function EQ(ms: MachineState) {
  const [a, b] = ms.stack.popN(2)
  const res = a === b ? 1n : 0n
  ms.stack.push(res)
}

// 0x15
function ISZERO(ms: MachineState) {
  const a = ms.stack.pop()
  const res = a === 0n ? 1n : 0n
  ms.stack.push(res)
}

// 0x16
function AND(ms: MachineState) {
  const [a, b] = ms.stack.popN(2)
  const res = a & b
  ms.stack.push(res)
}

// 0x17
function OR(ms: MachineState) {
  const [a, b] = ms.stack.popN(2)
  const res = a | b
  ms.stack.push(res)
}

// 0x18
function XOR(ms: MachineState) {
  const [a, b] = ms.stack.popN(2)
  const res = a ^ b
  ms.stack.push(res)
}

// 0x19
function NOT(ms: MachineState) {
  const a = ms.stack.pop()
  const res = bigMath.mod256(~a)
  ms.stack.push(res)
}

// 0x1a
function BYTE(ms: MachineState) {
  const [pos, val] = ms.stack.popN(2)
  const res = pos > 31n ? 0n : (val >> (8n * (31n - pos))) & 0xffn
  ms.stack.push(res)
}

// todo: 1b, 1c, 1d

// 0x20
function SHA3(ms: MachineState) {
  const [offset, size] = ms.stack.popN(2)
  const data = ms.memory.read(Number(offset)).subarray(0, Number(size))
  const hash = keccak256(data)
  const res = parseBytesIntoBigInt(hash)
  ms.stack.push(res)
}

// 0x30
function ADDRESS(ms: MachineState) {
  const res = ms.txData.to
  ms.stack.push(parseHexStringIntoBigInt(res))
}

// 0x31
function BALANCE(ms: MachineState) {
  const address = ms.stack.pop()
  const addressHex = parseBigintIntoHexString(address)
  const res = ms.globalState.getBalance(addressHex)
  ms.stack.push(res)
}

// 0x32
function ORIGIN(ms: MachineState) {
  const res = ms.txData.origin
  ms.stack.push(parseHexStringIntoBigInt(res))
}

// 0x33
function CALLER(ms: MachineState) {
  const res = ms.txData.from
  ms.stack.push(parseHexStringIntoBigInt(res))
}

// 0x34
function CALLVALUE(ms: MachineState) {
  const res = ms.txData.value
  ms.stack.push(res)
}

// 0x35
function CALLDATALOAD(ms: MachineState) {
  const offset = Number(ms.stack.pop())
  const calldataWord = ms.txData.data.subarray(offset, offset + 32)

  const calldataWordPadded = Buffer.alloc(32)
  calldataWord.copy(calldataWordPadded, 0, 0)

  const res = parseBytesIntoBigInt(calldataWordPadded)
  ms.stack.push(res)
}

// 0x36
function CALLDATASIZE(ms: MachineState) {
  const res = ms.txData.data.length
  ms.stack.push(BigInt(res))
}

// 0x37
function CALLDATACOPY(ms: MachineState) {
  const memOffset = Number(ms.stack.pop())
  const dataOffset = Number(ms.stack.pop())
  const size = Number(ms.stack.pop())

  const data = ms.txData.data.subarray(dataOffset, dataOffset + size)
  ms.memory.write(memOffset, data, size)
}

// 0x38
function CODESIZE(ms: MachineState) {
  const res = ms.code.length
  ms.stack.push(BigInt(res))
}

// 0x39
function CODECOPY(ms: MachineState) {
  const memOffset = Number(ms.stack.pop())
  const codeOffset = Number(ms.stack.pop())
  const size = Number(ms.stack.pop())

  const codeBytesPortion = ms.code.subarray(codeOffset, codeOffset + size)
  const codeBuffer = Buffer.from(codeBytesPortion)

  const code = Buffer.alloc(size)
  code.copy(codeBuffer, 0, 0)

  ms.memory.write(memOffset, code, size)
}

// 0x3a
function GASPRICE(ms: MachineState) {
  const res = ms.txData.gasprice
  ms.stack.push(res)
}

// todo: 0x3b .. 0x40

// 0x41
function COINBASE(ms: MachineState) {
  const res = ms.block.coinbase
  ms.stack.push(parseHexStringIntoBigInt(res))
}

// 0x42
function TIMESTAMP(ms: MachineState) {
  const res = ms.block.timestamp
  ms.stack.push(res)
}

// 0x43
function NUMBER(ms: MachineState) {
  const res = ms.block.number
  ms.stack.push(BigInt(res))
}

// 0x44
function DIFFICULTY(ms: MachineState) {
  const res = ms.block.difficulty
  ms.stack.push(BigInt(res))
}

// 0x45
function GASLIMIT(ms: MachineState) {
  const res = ms.block.gaslimit
  console.log(res)
  ms.stack.push(parseHexStringIntoBigInt(res))
}

// 0x46
function CHAINID(ms: MachineState) {
  const res = ms.block.chainid
  ms.stack.push(BigInt(res))
}

// 0x50
function POP(ms: MachineState) {
  ms.stack.pop()
}

// 0x51
function MLOAD(ms: MachineState) {
  const offset = Number(ms.stack.pop())
  const val = parseBytesIntoBigInt(ms.memory.read(offset))
  ms.stack.push(val)
}

// 0x52
function MSTORE(ms: MachineState) {
  const [offset, val] = ms.stack.popN(2)
  const word = parseBigIntIntoBytes(val, 32)
  ms.memory.write(Number(offset), word, 32)
}

// 0x53
function MSTORE8(ms: MachineState) {
  const [offset, val] = ms.stack.popN(2)
  const byte = parseBigIntIntoBytes(val, 1)
  ms.memory.write(Number(offset), byte, 1)
}

// todo: sload, sstore

// 0x56
function JUMP(ms: MachineState) {
  const dest = ms.stack.pop()
  if (dest > ms.code.length) throw new Error(ERRORS.JUMP_OUT_OF_BOUNDS)
  if (ms.code[Number(dest)] !== 0x5b) throw new Error(ERRORS.JUMP_TO_INVALID_DESTINATION)
  ms.pc = Number(dest)
}

// 0x57
function JUMPI(ms: MachineState) {
  const [dest, cond] = ms.stack.popN(2)
  if (cond === 0n) return
  if (dest > ms.code.length) throw new Error(ERRORS.JUMP_OUT_OF_BOUNDS)
  if (ms.code[Number(dest)] !== 0x5b) throw new Error(ERRORS.JUMP_TO_INVALID_DESTINATION)
  ms.pc = Number(dest)
}

// 0x58
function PC(ms: MachineState) {
  ms.stack.push(BigInt(ms.pc))
}

// 0x59
function MSIZE(ms: MachineState) {
  ms.stack.push(BigInt(ms.memory.size))
}

// TODO: 0x5a ... 0x5a

// 0x5b
function JUMPDEST(ms: MachineState) {
  // do nothing
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

// 0x80 - 0x8f
function DUP(ms: MachineState) {
  const pos = ms.code[ms.pc] - 0x7f
  const value = ms.stack.peek(pos)
  ms.stack.push(value)
}

// 0x90 - 0x9f
function SWAP(ms: MachineState) {
  const pos = ms.code[ms.pc] - 0x8f
  ms.stack.swap(pos)
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
  0x12: { name: "SLT", runner: SLT },
  0x13: { name: "SGT", runner: SGT },
  0x14: { name: "EQ", runner: EQ },
  0x15: { name: "ISZERO", runner: ISZERO },
  0x16: { name: "AND", runner: AND },
  0x17: { name: "OR", runner: OR },
  0x18: { name: "XOR", runner: XOR },
  0x19: { name: "NOT", runner: NOT },

  0x1a: { name: "BYTE", runner: BYTE },

  0x20: { name: "SHA3", runner: SHA3 },

  0x30: { name: "ADDRESS", runner: ADDRESS },
  0x31: { name: "BALANCE", runner: BALANCE },
  0x32: { name: "ORIGIN", runner: ORIGIN },

  0x33: { name: "CALLER", runner: CALLER },
  0x34: { name: "CALLVALUE", runner: CALLVALUE },
  0x35: { name: "CALLDATALOAD", runner: CALLDATALOAD },
  0x36: { name: "CALLDATASIZE", runner: CALLDATASIZE },
  0x37: { name: "CALLDATACOPY", runner: CALLDATACOPY },
  0x38: { name: "CODESIZE", runner: CODESIZE },
  0x39: { name: "CODECOPY", runner: CODECOPY },

  0x3a: { name: "GASPRICE", runner: GASPRICE },

  0x41: { name: "COINBASE", runner: COINBASE },
  0x42: { name: "TIMESTAMP", runner: TIMESTAMP },
  0x43: { name: "NUMBER", runner: NUMBER },
  0x44: { name: "DIFFICULTY", runner: DIFFICULTY },
  0x45: { name: "GASLIMIT", runner: GASLIMIT },
  0x46: { name: "CHAINID", runner: CHAINID },

  0x50: { name: "POP", runner: POP },
  0x51: { name: "MLOAD", runner: MLOAD },
  0x52: { name: "MSTORE", runner: MSTORE },
  0x53: { name: "MSTORE8", runner: MSTORE8 },

  0x56: { name: "JUMP", runner: JUMP },
  0x57: { name: "JUMPI", runner: JUMPI },
  0x58: { name: "PC", runner: PC },
  0x59: { name: "MSIZE", runner: MSIZE },

  0x5b: { name: "JUMPDEST", runner: JUMPDEST },

  ...buildOpcodeRangeObjects(0x60, 0x7f, "PUSH", PUSH),
  ...buildOpcodeRangeObjects(0x80, 0x8f, "DUP", DUP),
  ...buildOpcodeRangeObjects(0x90, 0x9f, "SWAP", SWAP),
}

export default runners
