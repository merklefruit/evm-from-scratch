# Day 14

Today I upgraded my EVM setup by pulling the newest version of the evm-from-scratch repo. Some things have been refactored and some have been added aswell. So I spent a few minutes adjusting the new tests to my old code. During the process, I had to implement a couple Opcodes that were added in order to get back at my last result, namely `GAS` and `LOG`.

`GAS` is simple, it pushes the remaining available gas to the stack, but I haven't implemented a full gas-tracking system yet, so this is still a work in progress I would say.

`LOG` required some extra work: I had to add the `logs` field to the MachineState and return it to the test result. Here's how I implemented the actual LOG runners (in a single function for all LOG Opcodes):

```typescript
function LOG(ms: MachineState) {
  // take the number of arguments from the opcode
  const n = ms.code[ms.pc] - 0xa0;

  // get the memory offset and size to read
  const [memOffset, size] = ms.stack.popN(2);

  // get the actual log topics from stack
  const topics = ms.stack.popN(n);

  // read the memory and parse the topics
  const data = ms.memory.read(Number(memOffset), Number(size));
  const topicsHex = topics.map(parsers.BigintIntoHexString);

  // push the log with the appropriate data and topics
  ms.logs.push({
    address: ms.txData.to,
    data: data.toString("hex"),
    topics: topicsHex,
  });
}
```

Also since today I had more time to dedicate, I implemented a big refactoring of the EVM class introducing a Logger, which is a way to visualize exactly what is happening on every execution step: stack, memory and storage dump.

I also added a way to start the EVM execution from a specified bytecode or an input file instead of only relying on provided tests, so I can potentially use it for more than just testing in the future... :D
