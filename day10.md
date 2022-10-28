# Day 10

Today I haven't got much time because I'm running late on my plans for the night, but I still managed to get a few things done. I started with the `CALLDATASIZE` Opcode, which was pretty straightforward. Then I moved on to the `CALLDATACOPY` Opcode, which was a bit more tricky but nothing too fancy. Here's how I did it:

```typescript
function CALLDATACOPY(ms: MachineState) {
  // copy a portion of the calldata to memory
  // taking 3 arguments from the stack:

  // dataOffset = where to start copying from in calldata
  const memOffset = Number(ms.stack.pop());

  // memOffset = where to start pasting in memory
  const dataOffset = Number(ms.stack.pop());

  // size = how many bytes to copy in memory
  const size = Number(ms.stack.pop());

  // then I can index the exact portion of calldata I want to copy
  const data = ms.txData.data.subarray(dataOffset, dataOffset + size);

  // and finally load it into memory
  ms.memory.write(memOffset, data, size);
}
```

Then I also implemented `CODESIZE` and `CODECOPY`. Both are very similar to their memory equivalent, with the only difference that I am parsing the code as an `Uint8Array` instead of a `Buffer`.

---

One unrelated thing which I haven't spent enough time on yet is the calculation of the gas used by the execution. I know that there are some pre-determined values that are subtracted from the initial gas limit, but there are other dynamic prices such as the memory expansion or storage slot access which depend based on some variables.

This is not part of the current EVM challenge, but maybe I could implement it as an add-on challenge in the future.
