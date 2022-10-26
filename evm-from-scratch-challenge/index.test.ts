import { expect, test } from "@jest/globals"

import evm from "."
import tests from "./evm.json"
import { buildTxData, hexStringToUint8Array } from "./src/utils"

import type { Test } from "./src/types"

for (const t of tests as Test[]) {
  test(t.name, async () => {
    // Note: as the test cases get more complex, you'll need to modify this
    // to pass down more arguments to the evm function (e.g. block, state, etc.)
    // and return more data (e.g. state, logs, etc.)

    const code = hexStringToUint8Array(t.code.bin)
    const txData = buildTxData(t)

    const result = await evm(code, txData)

    expect(result.stack).toEqual(t.expect.stack.map((item) => BigInt(item)))

    if (typeof t.expect.success !== "undefined")
      expect(result.success).toEqual(t.expect.success)
  })
}
