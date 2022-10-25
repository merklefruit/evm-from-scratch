import { MAX_256_BITS } from "../constants"

import type { OpcodeRunner, Runners } from "./types"

export function buildOpcodeRangeObjects(
  start: number,
  end: number,
  name: string,
  runner: OpcodeRunner
): Runners {
  const rangeRunners: Runners = {}
  for (let i = start; i <= end; i++) rangeRunners[i] = { name, runner }
  return rangeRunners
}

export function parseBytesIntoBigInt(bytes: Uint8Array): bigint {
  let array: string[] = []
  for (const byte of bytes) array.push(byte.toString(16).padStart(2, "0"))
  return BigInt("0x" + array.join(""))
}

export function parseBigIntIntoBytes(bigint: bigint, length: number): Buffer {
  const hex = bigint.toString(16).padStart(2 * length, "0")
  return Buffer.from(hex, "hex")
}

// https://stackoverflow.com/questions/51867270
export const bigMath = {
  abs(x: bigint): bigint {
    return x < 0n ? -x : x
  },
  sign(x: bigint): bigint {
    if (x === 0n) return 0n
    return x < 0n ? -1n : 1n
  },
  pow(base: bigint, exponent: bigint): bigint {
    return base ** exponent
  },
  min(value: bigint, ...values: bigint[]): bigint {
    for (const v of values) if (v < value) value = v
    return value
  },
  max(value: bigint, ...values: bigint[]): bigint {
    for (const v of values) if (v > value) value = v
    return value
  },
  toSigned256(x: bigint): bigint {
    return BigInt.asIntN(256, x)
  },
  toUnsigned256(x: bigint): bigint {
    return BigInt.asUintN(256, x)
  },
  mod256(x: bigint): bigint {
    const mod = x % MAX_256_BITS
    return mod < 0n ? mod + MAX_256_BITS : mod
  },
  ceil(x: bigint, ceil: bigint): bigint {
    const mod = x % ceil
    return mod === 0n ? x : x + ceil - mod
  },
}
