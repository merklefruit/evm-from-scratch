import EVM from "./src/evm"

export default async function evm(code: Uint8Array) {
  const evm = new EVM(code)

  const result = await evm.run()

  return { stack: result.stack }
}
