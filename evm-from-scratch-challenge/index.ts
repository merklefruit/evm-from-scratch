import EVM from "./src/evm"

import type { TxData, State } from "./src/types"

export default async function evm(code: Uint8Array, txData: TxData, state: State) {
  const evm = new EVM(code, txData, state)

  const result = await evm.run()

  return result
}
