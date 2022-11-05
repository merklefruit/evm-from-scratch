# Day 18

Today is a huge day. I have only 2 Opcodes left, `CREATE` and `SELFDESTRUCT`. Let's push to the end!!

## CREATE Instruction

```typescript
export async function CREATE(ms: MachineState, evm: EVM) {
  const [value, offset, length] = ms.stack.popN(3);

  // todo: generate real address: keccak256(rlp([sender_address,sender_nonce]))[12:]
  const sender = parsers.hexStringToUint8Array(ms.txData.to);
  const keccak = parsers.BufferToHexString(Buffer.from(keccak256(sender)));
  const addressCreated = keccak.substring(0, 42);

  // set the balance of the new address to the value sent to create
  ms.globalState.setAccount(addressCreated, { balance: value });

  // get the init code of the contract created
  const initCode = ms.memory.read(Number(offset), Number(length));

  // create a new machine state for the sub-context execution
  const createMachineState: MachineState = {
    ...ms,
    ...freshExecutionContext(),
    txData: {
      ...ms.txData,
      value: 0n,
      from: ZERO_ADDRESS,
      to: addressCreated,
    },
    code: initCode,
  };

  // run the sub-call
  const createResult = await evm.run(createMachineState, true);

  // if the sub-call failed, return 0.
  // otherwise, push the newly created address to the stack
  // and update the contract code to the return value of the sub-call
  if (createResult.success) {
    ms.globalState.setAccount(addressCreated, {
      ...ms.globalState.getAccount(addressCreated),
      code: parsers.hexStringToUint8Array(createResult.return),
    });

    ms.stack.push(parsers.HexStringIntoBigInt(addressCreated));
  } else ms.stack.push(CALL_RESULT.REVERT);
}
```

I learned a bunch of things here that I didn't know. First, the way the new address is generated was obscure to me. Then, I thought that the new contract code would be taken directly from the calldata, but it's actually the return value of the create sub-call. This is very interesting. I wonder how this works at the Solidity compiler level. Maybe I will have to look into that in the future. I also learned that the sub-call can fail, but the transaction can succeed because only the child context will return a failure but the parent is not affected.

## SELFDESTRUCT Instruction

```typescript
export function SELFDESTRUCT(ms: MachineState) {
  const [address] = ms.stack.popN(1);
  const addressToPay = parsers.BigintIntoHexString(address);
  const accountToPay = ms.globalState.getAccount(addressToPay);
  const accountToDestroy = ms.globalState.getAccount(ms.txData.to);

  // transfer the balance of the contract to the specified address
  if (accountToDestroy?.balance) {
    ms.globalState.setAccount(addressToPay, {
      ...accountToPay,
      balance: accountToDestroy.balance + (accountToPay?.balance || 0n),
    });
  }

  // delete the current contract and return
  ms.globalState.setAccount(ms.txData.to, {});
  ms.pc = ms.code.length;

  throw new Error(ERRORS.STOP);
}
```

For `SELFDESTRUCT`, I know for sure that this implementation is very incomplete, but it gets the basics right for passing the required tests. I think this challenge has the right amount of details to make it still fun to proceed without getting too bogged down in the single edge cases. So that was it!

---

## Conclusion

Yeah, that was the last Opcode of the challenge! I feel like I've talked about my feedback too many times already, so I will only say here that **it was awesome and I'm grateful to Winter for putting this together**.

I absolutely recommend undertaking this experience if you are curious about smart contracts and the Ethereum protocol in general. You will learn a ton of low-level details that will be immensely useful for your future smart contract projects. Shoutout to W1nt3r for putting this together!
