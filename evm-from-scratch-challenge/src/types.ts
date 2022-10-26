export type ProgramCounter = number
export type Gas = bigint
export type Address = string
export type Value = bigint

export interface Code {
  asm: string
  bin: string
}

export interface Test {
  name: string
  code: Code
  tx?: Partial<TxData>
  state?: State
  expect: {
    success?: boolean
    stack: string[]
  }
}

export interface TxData {
  to: Address
  from: Address
  value: Value
  origin: Address
}

export interface State {
  [key: Address]: Account
}

export interface Account {
  balance?: Value
}
