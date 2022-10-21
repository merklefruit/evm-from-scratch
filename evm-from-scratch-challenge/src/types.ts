export type ProgramCounter = number

export interface Code {
  asm: string
  bin: string
}

export interface Test {
  name: string
  state?: {
    [key: string]: {
      code: Code
    }
  }
  code: Code
  expect: {
    stack: string[]
  }
}
