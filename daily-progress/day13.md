# Day 13

Ok, it's finally time to put in practice what we've learned yesterday.

Here is the basic Storage I've come up with so far:

```typescript
// in machine-state/storage.ts you will find more explanation as to why I've chosen this format
// but basically it's a key-value store for each address.
type StorageLayout = Map<string, Map<string, Buffer>>;

export default class Storage {
  private _storage: StorageLayout;

  constructor() {
    this._storage = new Map();
  }

  public get(address: Address, key: string): Buffer {
    // simply access the map by address and get the value from the key
    return this._storage.get(address)?.get(key) ?? Buffer.alloc(32);
  }

  public set(address: Address, key: string, value: Buffer): void {
    if (value.length > 32) throw new Error(ERRORS.INVALID_STORAGE_VALUE_SIZE);

    // check if an old value exists for this key
    // if it doesn't, create a new map for this address
    const oldStorageValue = this._storage.get(address)?.get(key);
    if (!oldStorageValue) this._storage.set(address, new Map());

    // if the old value is the same as the new one, do nothing
    if (oldStorageValue?.equals(value)) return;

    // finally update the key with the new value
    this._storage.get(address)!.set(key, value);
  }
}
```

This passes all `SSTORE` and `SLOAD` tests for now, but I will need to implement the logger and persistent changes log later.

In the real EVM, storage changes aren't persisted until the transaction is finalized, and they are reverted if the transaction itself reverts. This simple storage doesn't account for this kind of logic yet.

Ok, now that the storage part seems to be working, let's move on to some more simple Opcodes!

`RETURN` is a good one. It halts the execution of the current frame and returns a portion of data read from memory. It's the first interaction with the `returnData` property, which I defined as a Buffer in the `MachineState` object.

`REVERT` is very similar to `RETURN`, but instead of throwing the `STOP` exception, it throws `REVERT` which does not indicate a special case for the run function.
