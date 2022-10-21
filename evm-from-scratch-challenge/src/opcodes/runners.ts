import { Opcode, OpcodeRunner } from "./types"

type Runners = Record<Opcode, { name: string; runner: OpcodeRunner }>

// 0x00
function STOP(ms) {
  throw new Error("STOP")
}

// 0x01
function ADD() {}

// 0x02
function MUL() {}

const runners: Runners = {
  0x00: { name: "STOP", runner: STOP },
  0x01: { name: "ADD", runner: ADD },
  0x02: { name: "MUL", runner: MUL },
}

export default runners
