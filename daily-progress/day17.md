# Day 17

Today I want to make some refactoring to the garbage that has become the `src/opcodes/runners.ts` file. It's currently 586 lines. I would like to split the runners by Opcode category, and I noticed that both evm.codes and the ethereum execution specs have a nice categorization of each opcode. I'm going to use that to split the runners into separate files.

Here are the instruction categories [as defined here](https://ethereum.github.io/execution-specs/autoapi/ethereum/gray_glacier/vm/instructions/index.html):

- Arithmetic
- Bitwise Logic
- Block
- Comparison
- Control Flow
- Environmental
- Keccak
- Logging
- Memory
- Stack
- Storage
- System

---

After this small refactoring, I proceeded with the next instructions: `DELEGATECALL` and `STATICCALL`. These are very similar to their `CALL` sibling, so most of the runner code was reused. There are some changes that make a huge difference when it comes to actual execution, and learning them by having to implement them manually was a great learning experience.

For instance, the `STATICCALL` Opcode required a new flag inside the MachineState struct: "static" now identifies if the current execution context is running in static mode. In this particular mode, the opcodes that change the global state of Ethereum are disallowed, for instance `SSTORE` and `CREATE`. What I didn't realize is that a simple `CALL` can be executed in static mode, but only if its context txData.value sent is equal to 0.

This course is making me appreciate the smart implementations baked in the EVM and the Ethereum protocol. I know I've said it already, but this has been a learning experience like no others for me. I'm really enjoying it.
