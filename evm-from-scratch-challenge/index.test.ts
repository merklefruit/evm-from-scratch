import { expect, test } from "@jest/globals"

import EVM from "./src/evm"
import tests from "./evm.json"
import { parsers } from "./src/opcodes/utils"
import { buildBlock, buildState, buildTxData } from "./src/utils"

import type { EvmRuntimeParams, Test } from "./src/types"

for (const t of tests as Test[]) {
  test(t.name, async () => {
    const evm = new EVM({ debug: true, saveLogs: false })

    const EvmRuntimeParams: EvmRuntimeParams = {
      _code: parsers.hexStringToUint8Array(t.code.bin),
      _asm: t.code.asm,
      _txData: buildTxData(t),
      _globalState: buildState(t),
      _block: buildBlock(t),
    }

    const result = await evm.start(EvmRuntimeParams)

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
