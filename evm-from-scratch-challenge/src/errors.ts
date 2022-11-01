enum ERRORS {
  STACK_OVERFLOW = "stack overflow",
  STACK_UNDERFLOW = "stack underflow",
  STACK_VALUE_TOO_BIG = "stack value too big",
  STACK_VALUE_TOO_SMALL = "stack value too small",
  INVALID_OPCODE = "invalid opcode",
  PC_OUT_OF_BOUNDS = "pc out of bounds",
  JUMP_OUT_OF_BOUNDS = "jump out of bounds",
  JUMP_TO_INVALID_DESTINATION = "jump to invalid destination",
  INVALID_MEMORY_OFFSET = "invalid memory offset",
  INVALID_MEMORY_VALUE_SIZE = "invalid memory value size",
  INVALID_STORAGE_KEY_SIZE = "invalid storage key size",
  INVALID_STORAGE_VALUE_SIZE = "invalid storage value size",

  STOP = "STOP",
  REVERT = "REVERT",

  NO_CODE_PROVIDED = "no code provided",
  OPCODE_NOT_IMPLEMENTED = "opcode not implemented",
}

export default ERRORS
