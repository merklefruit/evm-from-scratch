export function hexStringToUint8Array(hexString: string): Uint8Array {
  return new Uint8Array((hexString?.match(/../g) || []).map((byte) => parseInt(byte, 16)))
}
