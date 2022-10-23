import { OpcodeRunner, Runners } from "./types"

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
}
