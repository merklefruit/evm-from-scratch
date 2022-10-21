import type Memory from "../memory"
import type Stack from "../stack"
import { ProgramCounter } from "../types"

export type Opcode = string
export type OpcodeInfo = { name: string }
export type OpcodeRunner = (opcode: Opcode) => void

// From the yellow paper:
// Machine State: The machine state μ is defined as the tuple (g, pc, m, i, s)
// which are the gas available, the program counter pc ∈ N256 , the memory contents,
// the active number of words in memory (counting continuously from position 0),
// and the stack contents. The memory contents μm are a series of zeroes of size 2^256.

// The machine state is a tuple of:
// - gas available
// - program counter
// - memory contents
// - active number of words in memory
// - stack contents
export interface MachineState {
  gasAvailable: bigint
  programCounter: ProgramCounter
  memory: Memory
  activeWordsInMemory: bigint
  stack: Stack
}
