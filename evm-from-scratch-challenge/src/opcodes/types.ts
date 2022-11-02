import type EVM from "../evm"
import type { MachineState } from "../machine-state/types"

export type Opcode = number
export type OpcodeInfo = { name: string }
export type SimpleRunner = (ms: MachineState) => void | Promise<void>
export type CallOrCreateRunner = (ms: MachineState, evm: EVM) => void | Promise<void>
export type OpcodeRunner = SimpleRunner | CallOrCreateRunner
export type Runners = Record<Opcode, { name: string; runner: OpcodeRunner }>
