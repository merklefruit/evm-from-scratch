# Day 16

Okay so yesterday was a bit harsh, I was stuck on a bug where I couldn't get the right returnData to show after a sub-call finished executing. I'm happy to report that I've since solved the bug in 5 minutes after having it viewed with a fresh mind today. Here's what I was missing: `Buffer.from(value, "hex")` but I had forgotten to specify the hex encoding, and the default is UTF-8.

Anyway, now that `CALL` works, I can try and explain quickly how I implemented it. The `CALL` opcode is a bit tricky because it requires a lot of state to be saved and restored. The way I did it was to create a new `MachineState` instance, which is basically a copy of the current state (with a new program counter, etc) and then execute the code of the called contract. After the execution is finished, the return data is copied back to the original state and the execution continues. This makes use of recursion, and there is a `depth` variable that tracks how deep the current call stack is.

Another difference from other Opcodes seen so far, as explained in yesterday's report, is that the `CALL` runner also takes in the EVM class other than the MachineState. This is to be able to call `evm.run()` to execute a sub-call.

```typescript
async function CALL(ms: MachineState, evm: EVM) {
  // read required call arguments from the stack
  const [gas, address, value, argsOffset, argsSize, retOffset, retSize] =
    ms.stack.popN(7);

  // parse them into calldata and target address
  const data = ms.memory.read(Number(argsOffset), Number(argsSize));
  const to = parsers.BigintIntoHexString(address);

  // get the code of the contract to be called (return success if empty)
  const codeToCall = ms.globalState.getAccount(to).code;
  if (!codeToCall) return ms.stack.push(CALL_RESULT.SUCCESS);

  // generate a new machine state for the sub-call
  const callMachineState: MachineState = {
    // start by copying the current state
    ...ms,
    // but with a new program counter, memory and stack
    ...freshExecutionContext(),
    // also with custom gas limit (should be below a threshold, todo!)
    gasAvailable: gas,

    // the most important part: the new txData and code to execute
    txData: { ...ms.txData, from: ms.txData.to, to, value, data },
    code: codeToCall,
  };

  // execute the sub-call invoking the evm method (recursion!)
  const callResult = await evm.run(callMachineState, true);

  // save the return data to the memory if needed
  if (callResult.return) {
    // here's the bug I wasted 1 hour on yesterday: "hex" encoding!
    const callReturnData = Buffer.from(callResult.return, "hex");
    const callReturnOffset = Number(retOffset);
    const callReturnSize = Number(retSize);

    ms.returnData = callReturnData;

    if (callReturnSize > 0)
      ms.memory.write(callReturnOffset, callReturnData, callReturnSize);
  }

  if (callResult.success) ms.stack.push(CALL_RESULT.SUCCESS);
  else ms.stack.push(CALL_RESULT.REVERT);
}
```
