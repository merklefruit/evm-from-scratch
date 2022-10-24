# Day 6

Today I will try to finalize the implmentation of the arithmetic opcodes and pass all the related tests.

EDIT: I overdid it a bit, and also implemented: `SDIV`, `MOD`, `SMOD`, `LT`, `GT`, `SLT`, `SGT`, `EQ`, `ISZERO`, `AND`, `OR`, `XOR`, `NOT`, `BYTE`, `JUMP`, `JUMPI` and `JUMPDEST`. I managed to do so many of them together because they don't require any new data structures, and they all are pretty basic. Nonetheless I learned a lot trying to debug the differences between `DIV` and `SDIV`, which then made the others easier to implement once I understood the modulo-256-bit pattern.

I am noticing that the `src/opcodes/runner.ts` file is getting a touch crowded. I might refactor the runners into subfolders and just import them into a general runners file.

While reading through the "EVM Illustrated" slides, I came across the debug view functionality available in geth. It's a great way to visualize all the state changes that occur during an execution, so I want to implement something similar in my EVM in the future.

I also found and fixed a bug in the stack `popN` method, in which I returned the items in the wrong order.

## Resources

- [Ethereum Specification](https://ethereum.github.io/execution-specs/autoapi/ethereum/index.html): A collection of documents that describe the Ethereum protocol, maintained by the Ethereum Foundation. Great insights about specific opcodes implementation in there as well.
- [EVM Rust crate](https://docs.rs/evm/latest/evm/index.html): A Rust crate that implements the EVM. Will be useful in the future maybe!
