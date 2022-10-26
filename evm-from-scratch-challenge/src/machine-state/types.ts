import type Stack from "./stack"
import type Memory from "./memory"
import type Storage from "./storage"
import type GlobalState from "../globalState"
import type { Block, Gas, ProgramCounter, TxData } from "../types"

// From the yellow paper:
// Machine State: The machine state μ is defined as the tuple (g, pc, m, i, s)
// which are the gas available, the program counter pc ∈ N256 , the memory contents,
// the active number of words in memory (counting continuously from position 0),
// and the stack contents. The memory contents μm are a series of zeroes of size 2^256.

// The machine state is a tuple defined of:
// - gas available
// - program counter
// - memory contents
// - active number of words in memory
// - stack contents

// I decided to implement the activeWordsCount method directly in the Memory class
// instead of having it stand-alone in the MachineState interface.

// I also added items that make state manipulation in opcodes complete with a single object:
// - code (bin): the full code of the current execution context
// - txData: the transaction data of the current execution context
// - storage: the transient account state map of the current execution context
// - globalState: the global state of the current execution context
// - block: the block data of the current execution context

export interface MachineState {
  gasAvailable: Gas
  pc: ProgramCounter
  memory: Memory
  stack: Stack

  code: Uint8Array
  txData: TxData
  storage: Storage
  globalState: GlobalState
  block: Block
}
