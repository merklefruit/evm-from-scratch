# Day 5

Wow, things are taking shape faster than I anticipated! I finalized the `PUSH` opcode, which required providing the opcode runner with a reference to the execution code and program counter, which needs to be incremented for the number of bytes corresponding to the push instruction. For now I am using a simple `MachineState` context struct for this.

I also implemented a few more simple opcodes such as `SUB` and `POP`. For each instruction I am also making sure that the overflow/underflow cases are handled correctly. The challenge tests help a lot with this.

## Resources

An incredibly useful resource I forgot to mention is the [EVM illustrated](https://takenobu-hs.github.io/downloads/ethereum_evm_illustrated.pdf) which does a great job of explaining the state transitions of the EVM and exactly what data dependencies are involved in each different operation.

From reading these slides, I already know that the two major challenges will be implementing the `CREATE` and `CALL` operations, but these will surely be the subject of future posts.

## Other thoughts

I am noticing that many opcodes have repeated functionality, such as the `PUSH` operation which has 32 different sizes, or the `POP` operation which has 16. I think it's worth to generalize the implementation of these runners to avoid repeated code, with a helper function that chooses the correct runner based on the opcode range.

Update: I did this with a simple util called `buildOpcodeRangeObjects` and I love how elegant & clear the result looks.

## Unit tests

I am following the evm-from-scratch challenge which offers a test suite of the evm functionality, but I am thinking of starting to write proper unit tests to isolate the more complex parts of the project. Perhaps I will postpone this until I have to deal with the more difficult parts like `CREATE` and `CALL`.
