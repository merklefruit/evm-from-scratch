import Memory from "./memory"
import Stack from "./stack"

import type { MachineState } from "./types"

export function freshExecutionContext(): Partial<MachineState> {
  return {
    stack: new Stack(),
    memory: new Memory(),
    pc: 0,
  }
}
