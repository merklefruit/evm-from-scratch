export type Gas = bigint
export type Value = bigint
export type Address = string
export type ProgramCounter = number
export type Calldata = Buffer

export interface Code {
  asm: string
  bin: string
}

export interface Test {
  name: string
  code: Code
  tx?: Partial<TestTxData>
  block?: Partial<Block>
  state?: State
  expect: {
    success?: boolean
    stack: string[]
  }
}

type TestTxData = Omit<TxData, "data"> & { data: string }

export interface TxData {
  to: Address
  from: Address
  value: Value
  origin: Address
  gasprice: Gas
  data: Calldata
}

export interface State {
  [key: Address]: Account
}

export interface Account {
  balance?: Value
}

export interface Block {
  number: number
  timestamp: bigint
  coinbase: Address
  difficulty: bigint
  gaslimit: string
  chainid: number
}
