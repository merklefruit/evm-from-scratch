import type { Test, TxData } from "./types"

export function hexStringToUint8Array(hexString: string): Uint8Array {
  return new Uint8Array((hexString?.match(/../g) || []).map((byte) => parseInt(byte, 16)))
}

export function buildTxData(t: Test): TxData {
  return { to: t.tx?.to || "", from: t.tx?.from || "" }
}
