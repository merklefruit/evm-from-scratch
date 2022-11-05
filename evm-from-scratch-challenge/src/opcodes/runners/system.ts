import { keccak256 } from "ethereum-cryptography/keccak"

import ERRORS from "../../errors"
import { freshExecutionContext } from "../../machine-state/utils"
import { parsers, CALL_RESULT } from "../utils"

import type EVM from "../../evm"
import type { MachineState } from "../../machine-state/types"

// 0xf0
export async function CREATE(ms: MachineState, evm: EVM) {
  const [value, offset, length] = ms.stack.popN(3)

  // todo: generate real address: keccak256(rlp([sender_address,sender_nonce]))[12:]
  const sender = parsers.hexStringToUint8Array(ms.txData.to)
  const keccak = parsers.BufferToHexString(Buffer.from(keccak256(sender)))
  const addressCreated = keccak.substring(0, 42)

  ms.globalState.setAccount(addressCreated, { balance: value })

  const initCode = ms.memory.read(Number(offset), Number(length))

  const createMachineState: MachineState = {
    ...ms,
    ...freshExecutionContext(),
    txData: {
      ...ms.txData,
      value: 0n,
      from: addressCreated,
      to: addressCreated,
    },
    code: initCode,
  }

  const createResult = await evm.run(createMachineState, true)

  if (createResult.success) {
    ms.globalState.setAccount(addressCreated, {
      ...ms.globalState.getAccount(addressCreated),
      code: parsers.hexStringToUint8Array(createResult.return),
    })

    ms.stack.push(parsers.HexStringIntoBigInt(addressCreated))
  } else ms.stack.push(CALL_RESULT.REVERT)
}

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

// 0xf4
export async function DELEGATECALL(ms: MachineState, evm: EVM) {
  const [gas, address, argsOffset, argsSize, retOffset, retSize] = ms.stack.popN(6)

  const data = ms.memory.read(Number(argsOffset), Number(argsSize))
  const to = parsers.BigintIntoHexString(address)
  const codeToCall = ms.globalState.getAccount(to).code

  if (!codeToCall) return ms.stack.push(CALL_RESULT.SUCCESS)

  const callMachineState: MachineState = {
    ...ms,
    ...freshExecutionContext(),
    gasAvailable: gas,

    // The caller and value are the same as the current context
    txData: { ...ms.txData, data },
    code: codeToCall,
  }

  const callResult = await evm.run(callMachineState, true)

  console.log(callResult)

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

// 0xfa
export async function STATICCALL(ms: MachineState, evm: EVM) {
  const [gas, address, argsOffset, argsSize, retOffset, retSize] = ms.stack.popN(6)

  const data = ms.memory.read(Number(argsOffset), Number(argsSize))
  const to = parsers.BigintIntoHexString(address)
  const codeToCall = ms.globalState.getAccount(to).code

  if (!codeToCall) return ms.stack.push(CALL_RESULT.SUCCESS)

  const callMachineState: MachineState = {
    ...ms,
    ...freshExecutionContext(),
    gasAvailable: gas,
    txData: { ...ms.txData, data },
    code: codeToCall,
    static: true,
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

// 0xfd
export function REVERT(ms: MachineState) {
  const [offset, size] = ms.stack.popN(2)
  const ret = ms.memory.read(Number(offset), Number(size))
  ms.returnData = ret
  ms.pc = ms.code.length

  throw new Error(ERRORS.REVERT)
}
