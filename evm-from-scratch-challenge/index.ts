import EVM from "./src/evm"

import type { TxData } from "./src/types"

export default async function evm(code: Uint8Array, txData: TxData) {
  const evm = new EVM(code, txData)

  const result = await evm.run()

  return result
}
