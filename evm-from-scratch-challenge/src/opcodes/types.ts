import { MachineState } from "../machine-state/types"

export type Opcode = number
export type OpcodeInfo = { name: string }
export type OpcodeRunner = (ms: MachineState) => void | Promise<void>
export type Runners = Record<Opcode, { name: string; runner: OpcodeRunner }>
