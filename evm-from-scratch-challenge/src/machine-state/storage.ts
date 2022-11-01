import ERRORS from "../errors"
import type { Address } from "../types"

// From the ethereum yellow paper:
// the storage is a mapping from 256-bit words to 256-bit words
// for each address. The storage is initially empty on account creation
// and can be modified by the execution of EVM code.
//
// Refer to `day12.md` for more information and theory on the storage.

// I basically need a map over ethereum addresses to maps over strings to 256-bit words
// interface StorageLayout {
//   [address: string]: {
//     [key: string]: Buffer
//   }
// }
//
// this is more efficiently implemented with maps:

type StorageLayout = Map<string, Map<string, Buffer>>

export default class Storage {
  private _storage: StorageLayout

  constructor() {
    this._storage = new Map()
  }

  public get(address: Address, key: string): Buffer {
    return this._storage.get(address)?.get(key) ?? Buffer.alloc(32)
  }

  public set(address: Address, key: string, value: Buffer): void {
    // todo: add validation for key size after switching to buffers

    if (value.length > 32) throw new Error(ERRORS.INVALID_STORAGE_VALUE_SIZE)

    const oldStorageValue = this._storage.get(address)?.get(key)
    if (!oldStorageValue) this._storage.set(address, new Map())
    if (oldStorageValue?.equals(value)) return

    // todo: implement logger & persistent changes log

    this._storage.get(address)!.set(key, value)
  }

  public getAsBigInt(address: Address, key: string): bigint {
    return BigInt("0x" + this.get(address, key).toString("hex"))
  }

  public setAsBigInt(address: Address, key: string, value: bigint): void {
    this.set(address, key, Buffer.from(value.toString(16).padStart(64, "0"), "hex"))
  }

  get dump(): string {
    return JSON.stringify(this._storage, null, 2)
  }
}
