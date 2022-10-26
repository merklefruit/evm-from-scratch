import { Account, Address, State } from "./types"

// For the sake of this test-based challenge,
// the global state is just a map of addresses to account info,
// which is passed directly from the test file.

export default class GlobalState {
  private _state: State

  constructor(_state: State) {
    this._state = _state
  }

  getAccount(address: Address): Account {
    return this._state[address] ?? {}
  }

  setAccount(address: Address, account: Account) {
    this._state[address] = account
  }

  getBalance(address: Address): bigint {
    return this.getAccount(address)?.balance ?? 0n
  }
}
