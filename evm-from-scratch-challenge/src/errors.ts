enum ERRORS {
  STACK_OVERFLOW = "stack overflow",
  STACK_UNDERFLOW = "stack underflow",
  STACK_VALUE_TOO_BIG = "stack value too big",
  STACK_VALUE_TOO_SMALL = "stack value too small",
  INVALID_OPCODE = "invalid opcode",
  PC_OUT_OF_BOUNDS = "pc out of bounds",
  JUMP_OUT_OF_BOUNDS = "jump out of bounds",
  JUMP_TO_INVALID_DESTINATION = "jump to invalid destination",

  STOP = "STOP",
  REVERT = "REVERT",
}

export default ERRORS
