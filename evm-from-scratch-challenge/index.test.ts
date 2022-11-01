import { expect, test } from "@jest/globals"

import evm from "."
import tests from "./evm.json"
import { parsers } from "./src/opcodes/utils"
import { buildBlock, buildState, buildTxData } from "./src/utils"

import type { Test } from "./src/types"

for (const t of tests as Test[]) {
  test(t.name, async () => {
    const code = parsers.hexStringToUint8Array(t.code.bin)
    const txData = buildTxData(t)
    const state = buildState(t)
    const block = buildBlock(t)

    const result = await evm(code, txData, state, block)

    if (typeof t.expect.stack !== "undefined")
      expect(result.stack).toEqual(
        t.expect.stack.map((item) => parsers.HexStringIntoBigInt(item))
      )

    if (typeof t.expect.success !== "undefined")
      expect(result.success).toEqual(t.expect.success)

    if (typeof t.expect.return !== "undefined")
      expect(result.return).toEqual(t.expect.return)

    if (typeof t.expect.logs !== "undefined") expect(result.logs).toEqual(t.expect.logs)
  })
}
