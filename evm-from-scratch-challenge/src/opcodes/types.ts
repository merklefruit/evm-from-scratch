export type Opcode = string
export type OpcodeInfo = { name: string }
export type OpcodeRunner = (opcode: Opcode) => void
