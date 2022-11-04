import ERRORS from "../../errors"
import { freshExecutionContext } from "../../machine-state/utils"
import { parsers, CALL_RESULT } from "../utils"

import type EVM from "../../evm"
import type { MachineState } from "../../machine-state/types"

// 0xf1
export async function CALL(ms: MachineState, evm: EVM) {
  const [gas, address, value, argsOffset, argsSize, retOffset, retSize] = ms.stack.popN(7)

  const data = ms.memory.read(Number(argsOffset), Number(argsSize))
  const to = parsers.BigintIntoHexString(address)
  const codeToCall = ms.globalState.getAccount(to).code

  if (!codeToCall) return ms.stack.push(CALL_RESULT.SUCCESS)

  const callMachineState: MachineState = {
    ...ms,
    ...freshExecutionContext(),
    gasAvailable: gas,
    txData: { ...ms.txData, from: ms.txData.to, to, value, data },
    code: codeToCall,
  }

  const callResult = await evm.run(callMachineState, true)

  if (callResult.return) {
    const callReturnData = Buffer.from(callResult.return, "hex")
    const callReturnOffset = Number(retOffset)
    const callReturnSize = Number(retSize)

    ms.returnData = callReturnData

    if (callReturnSize > 0)
      ms.memory.write(callReturnOffset, callReturnData, callReturnSize)
  }

  if (callResult.success) ms.stack.push(CALL_RESULT.SUCCESS)
  else ms.stack.push(CALL_RESULT.REVERT)
}

// 0xf3
export function RETURN(ms: MachineState) {
  const [offset, size] = ms.stack.popN(2)
  const ret = ms.memory.read(Number(offset), Number(size))
  ms.returnData = ret
  ms.pc = ms.code.length

  throw new Error(ERRORS.STOP)
}

// 0xfd
export function REVERT(ms: MachineState) {
  const [offset, size] = ms.stack.popN(2)
  const ret = ms.memory.read(Number(offset), Number(size))
  ms.returnData = ret
  ms.pc = ms.code.length

  throw new Error(ERRORS.REVERT)
}
