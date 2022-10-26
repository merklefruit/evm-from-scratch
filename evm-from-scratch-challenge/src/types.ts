export type ProgramCounter = number

export interface Code {
  asm: string
  bin: string
}

export interface Test {
  name: string
  code: Code
  tx?: Partial<TxData>
  expect: {
    success?: boolean
    stack: string[]
  }
}

export interface TxData {
  to: string
  from: string
}
