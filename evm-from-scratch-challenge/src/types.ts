export type Gas = bigint
export type Value = bigint
export type Address = string
export type ProgramCounter = number
export type Calldata = Buffer

export interface Code {
  asm: string
  bin: string
}

interface TestOutput {
  success: boolean
  stack: string[]
  return: string
  logs: Log[]
}

export interface Test {
  name: string
  code: Code
  tx?: Partial<TestTxData>
  block?: Partial<Block>
  state?: TestState
  expect: Partial<TestOutput>
}

type TestTxData = Omit<TxData, "data"> & { data: string }
type TestAccount = Omit<Account, "code"> & { code: Code }
type TestState = Record<Address, TestAccount>

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
  code?: Uint8Array
}

export interface Block {
  number: number
  timestamp: bigint
  coinbase: Address
  difficulty: bigint
  gaslimit: string
  chainid: number
}

export interface Log {
  address: Address
  topics: string[]
  data: string
}
