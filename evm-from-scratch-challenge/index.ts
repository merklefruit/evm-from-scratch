import EVM from "./src/evm"

import type { TxData, State, Block } from "./src/types"

export default async function evm(
  code: Uint8Array,
  txData: TxData,
  state: State,
  block: Block
) {
  const evm = new EVM(code, txData, state, block)

  const result = await evm.run()

  return result
}
