import { parsers } from "../utils"

import type { MachineState } from "../../machine-state/types"

// 0xa0 - 0xa4
export function LOG(ms: MachineState) {
  const n = ms.code[ms.pc] - 0xa0
  const [memOffset, size] = ms.stack.popN(2)
  const topics = ms.stack.popN(n)

  const data = ms.memory.read(Number(memOffset), Number(size))
  const topicsHex = topics.map(parsers.BigintIntoHexString)

  ms.logs.push({
    address: ms.txData.to,
    data: data.toString("hex"),
    topics: topicsHex,
  })
}
