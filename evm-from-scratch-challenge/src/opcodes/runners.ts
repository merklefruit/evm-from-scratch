import { buildOpcodeRangeObjects } from "./utils"
import type { Runners } from "./types"

// Opcode Runners categorization based on the EVM Execution Spec:
// https://ethereum.github.io/execution-specs/autoapi/ethereum/gray_glacier/vm/instructions/index.html

import * as arithmetic from "./runners/arithmetic"
import * as bitwise from "./runners/bitwise"
import * as block from "./runners/block"
import * as comparison from "./runners/comparison"
import * as controlFlow from "./runners/control-flow"
import * as environmental from "./runners/environmental"
import * as keccak from "./runners/keccak"
import * as logging from "./runners/logging"
import * as memory from "./runners/memory"
import * as stack from "./runners/stack"
import * as storage from "./runners/storage"
import * as system from "./runners/system"

const runners: Runners = {
  0x00: { name: "STOP", runner: controlFlow.STOP },
  0x01: { name: "ADD", runner: arithmetic.ADD },
  0x02: { name: "MUL", runner: arithmetic.MUL },
  0x03: { name: "SUB", runner: arithmetic.SUB },
  0x04: { name: "DIV", runner: arithmetic.DIV },
  0x05: { name: "SDIV", runner: arithmetic.SDIV },
  0x06: { name: "MOD", runner: arithmetic.MOD },
  0x07: { name: "SMOD", runner: arithmetic.SMOD },

  0x10: { name: "LT", runner: comparison.LT },
  0x11: { name: "GT", runner: comparison.GT },
  0x12: { name: "SLT", runner: comparison.SLT },
  0x13: { name: "SGT", runner: comparison.SGT },
  0x14: { name: "EQ", runner: comparison.EQ },
  0x15: { name: "ISZERO", runner: comparison.ISZERO },
  0x16: { name: "AND", runner: bitwise.AND },
  0x17: { name: "OR", runner: bitwise.OR },
  0x18: { name: "XOR", runner: bitwise.XOR },
  0x19: { name: "NOT", runner: bitwise.NOT },
  0x1a: { name: "BYTE", runner: bitwise.BYTE },

  0x20: { name: "SHA3", runner: keccak.SHA3 },

  0x30: { name: "ADDRESS", runner: environmental.ADDRESS },
  0x31: { name: "BALANCE", runner: environmental.BALANCE },
  0x32: { name: "ORIGIN", runner: environmental.ORIGIN },

  0x33: { name: "CALLER", runner: environmental.CALLER },
  0x34: { name: "CALLVALUE", runner: environmental.CALLVALUE },
  0x35: { name: "CALLDATALOAD", runner: environmental.CALLDATALOAD },
  0x36: { name: "CALLDATASIZE", runner: environmental.CALLDATASIZE },
  0x37: { name: "CALLDATACOPY", runner: environmental.CALLDATACOPY },
  0x38: { name: "CODESIZE", runner: environmental.CODESIZE },
  0x39: { name: "CODECOPY", runner: environmental.CODECOPY },

  0x3a: { name: "GASPRICE", runner: environmental.GASPRICE },
  0x3b: { name: "EXTCODESIZE", runner: environmental.EXTCODESIZE },
  0x3c: { name: "EXTCODECOPY", runner: environmental.EXTCODECOPY },
  0x3d: { name: "RETURNDATASIZE", runner: environmental.RETURNDATASIZE },
  0x3e: { name: "RETURNDATACOPY", runner: environmental.RETURNDATACOPY },

  0x41: { name: "COINBASE", runner: block.COINBASE },
  0x42: { name: "TIMESTAMP", runner: block.TIMESTAMP },
  0x43: { name: "NUMBER", runner: block.NUMBER },
  0x44: { name: "DIFFICULTY", runner: block.DIFFICULTY },
  0x45: { name: "GASLIMIT", runner: block.GASLIMIT },
  0x46: { name: "CHAINID", runner: block.CHAINID },
  0x47: { name: "SELFBALANCE", runner: environmental.SELFBALANCE },

  0x50: { name: "POP", runner: stack.POP },
  0x51: { name: "MLOAD", runner: memory.MLOAD },
  0x52: { name: "MSTORE", runner: memory.MSTORE },
  0x53: { name: "MSTORE8", runner: memory.MSTORE8 },
  0x54: { name: "SLOAD", runner: storage.SLOAD },
  0x55: { name: "SSTORE", runner: storage.SSTORE },

  0x56: { name: "JUMP", runner: controlFlow.JUMP },
  0x57: { name: "JUMPI", runner: controlFlow.JUMPI },
  0x58: { name: "PC", runner: controlFlow.PC },
  0x59: { name: "MSIZE", runner: memory.MSIZE },
  0x5a: { name: "GAS", runner: controlFlow.GAS },
  0x5b: { name: "JUMPDEST", runner: controlFlow.JUMPDEST },

  ...buildOpcodeRangeObjects(0x60, 0x7f, "PUSH", stack.PUSH),
  ...buildOpcodeRangeObjects(0x80, 0x8f, "DUP", stack.DUP),
  ...buildOpcodeRangeObjects(0x90, 0x9f, "SWAP", stack.SWAP),
  ...buildOpcodeRangeObjects(0xa0, 0xa4, "LOG", logging.LOG),

  0xf1: { name: "CALL", runner: system.CALL },
  0xf3: { name: "RETURN", runner: system.RETURN },
  0xf4: { name: "DELEGATECALL", runner: system.DELEGATECALL },

  0xfa: { name: "STATICCALL", runner: system.STATICCALL },

  0xfd: { name: "REVERT", runner: system.REVERT },
}

export default runners
