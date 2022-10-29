import { expect, test } from "@jest/globals"

import evm from "."
import tests from "./evm.json"
import { buildBlock, buildState, buildTxData, hexStringToUint8Array } from "./src/utils"

import type { Test } from "./src/types"

for (const t of tests as Test[]) {
  test(t.name, async () => {
    const code = hexStringToUint8Array(t.code.bin)
    const txData = buildTxData(t)
    const state = buildState(t)
    const block = buildBlock(t)

    const result = await evm(code, txData, state, block)

    // Always check stack result
    expect(result.stack).toEqual(t.expect.stack.map((item) => BigInt(item)))

    // Conditionally check success result
    if (typeof t.expect.success !== "undefined")
      expect(result.success).toEqual(t.expect.success)
  })
}
