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
    if (key.length !== 32) throw new Error(ERRORS.INVALID_STORAGE_KEY_SIZE)
    if (value.length > 32) throw new Error(ERRORS.INVALID_STORAGE_VALUE_SIZE)

    const oldStorageValue = this._storage.get(address)?.get(key)
    if (!oldStorageValue) this._storage.set(address, new Map())
    if (oldStorageValue?.equals(value)) return

    // todo: implement logger & persistent changes log
    console.log("storage value changed")
    console.log("old value:", oldStorageValue)
    console.log("new value:", value)

    this._storage.get(address)!.set(key, value)
  }
}
