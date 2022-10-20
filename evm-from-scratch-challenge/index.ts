import EVM from "./src/evm"

export default async function evm(code: Uint8Array) {
  const evm = new EVM()

  const result = await evm.run(code)

  return { stack: result.stack }
}
