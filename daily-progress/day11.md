# Day 11

I am approaching the end of the challenge, and in my opinion this is the most fun part. I will need to redo most of my main EVM class to allow for the `CALL` and `CREATE` operations, but I am looking forward to it.

Today I implemented `EXTCODESIZE` which was pretty easy, I just had to modify my `buildState` function to also include the code of any external account provided in the test. Then it was just a matter of returning the size of the code of the account pulled from the stack.

After that, I tried my hand at `EXTCODECOPY`. This one was definitely one of the longest ones in terms of lines of code, but after having dealt with many Opcodes handling memory slices and manipulating them, I was able to complete it quite quickly.

Here's a rundown of what `EXTCODECOPY` does: fun-fact, it's the first Opcode I encountered that takes 4 arguments from the stack!

```typescript
function EXTCODECOPY(ms: MachineState) {
  // We want to copy a portion of code of the account at the `address` on the stack
  // into the memory slice starting at the `offset` and of length `size` bytes

  // the first argument is the address of the account to copy the code from
  const address = ms.stack.pop();
  const addressHex = parsers.BigintIntoHexString(address);
  const extAccount = ms.globalState?.getAccount(addressHex);

  // then we load the other 3 arguments
  const memOffset = Number(ms.stack.pop());
  const codeOffset = Number(ms.stack.pop());
  const size = Number(ms.stack.pop());

  // we get the code portion of the external account (it can be undefined)
  // I parsed this as Uint8Array to stay consistent with the main account code
  const codeBytesPortion = extAccount?.code?.subarray(
    codeOffset,
    codeOffset + size
  );

  // we prepare a buffer of the right size from the Uint8Array slice created above
  // also making sure to account for the undefined case
  const codeBuffer = Buffer.from(codeBytesPortion ?? Buffer.alloc(0));

  // we use our usual trick to copy the buffer into the memory slice
  const code = Buffer.alloc(size);
  codeBuffer.copy(code, 0, 0);

  // and finally we write it into memory
  ms.memory.write(memOffset, code, size);
}
```

I then also implemented `SELFBALANCE` which was very simply pushing `ms.globalState.getBalance(ms.txData.to)` onto the stack.

That's it for today!

Progress so far: _91 passed, 101 total_.
