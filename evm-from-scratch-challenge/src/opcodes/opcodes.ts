import { Opcode, OpcodeInfo } from "./types"

const opcodes: Record<Opcode, OpcodeInfo> = {
  // 0x00 - arithmetic
  0x00: { name: "STOP" },
  0x01: { name: "ADD" },
  0x02: { name: "MUL" },
}
