# EVM From Scratch Challenge

> I implemented the Ethereum Virtual Machine from scratch in Typescript. The only external dependency is the `ethereum-cryptography` package used for the keccak256 hash function.

## Introduction

The EVM is the core of the Ethereum protocol. It is a stack-based virtual machine that executes bytecode and updates the glogbal state according to the rules described in the [Ethereum Yellow Paper](https://ethereum.github.io/yellowpaper/paper.pdf). The EVM is responsible for executing smart contracts and is what makes Ethereum a "World Computer".

## What is this challenge about?

[W1nt3r.eth](https://twitter.com/w1nt3r_eth) is the creator of the [EVM From Scratch](https://github.com/w1nt3r-eth/evm-from-scratch) challenge, which consists in a series of 116 tests that need to be passed sequentially in order to have a working EVM implementation. The challenge is a great way to learn about the EVM and how it works. I highly recommend it if you want to _really understand_ what is going on under the hood of Ethereum smart contracts.

## Progress Log

- [x] [Day 0](./daily-progress/day00.md): Research of relevant learning material & tools to get started
- [x] [Day 1](./daily-progress/day01.md): Gathering more resources & reading Mastering Ethereum chapter 13
- [x] [Day 2](./daily-progress/day02.md): Setting up the EVM-from-scratch challenge & EVM class
- [x] [Day 3](./daily-progress/day03.md): Reading the yellow paper & EVM inception (EVM inside EVM)
- [x] [Day 4](./daily-progress/day04.md): Stack & memory implementation & first Opcodes
- [x] [Day 5](./daily-progress/day05.md): PUSH, POP, SUB Opcodes, MachineState context struct
- [x] [Day 6](./daily-progress/day06.md): Most Arithmetic, Comparison, Bitwise operations & JUMP Opcodes
- [x] [Day 7](./daily-progress/day07.md): Memory structure & related Opcodes
- [x] [Day 8](./daily-progress/day08.md): TxData, globalState, Block data & related Opcodes
- [x] [Day 9](./daily-progress/day09.md): More Environmental Opcodes & CALLDATALOAD. "Officially" started the challenge!
- [x] [Day 10](./daily-progress/day10.md): CALLDATASIZE, CALLDATACOPY, CODESIZE, CODECOPY Opcodes
- [x] [Day 11](./daily-progress/day11.md): EXTCODESIZE, EXTCODECOPY, SELFBALANCE Opcodes
- [x] [Day 12](./daily-progress/day12.md): Research & study on the Storage / data layer of the Ethereum protocol
- [x] [Day 13](./daily-progress/day13.md): Simple Storage implementation, SSTORE, SLOAD, RETURN, REVERT Opcodes
- [x] [Day 14](./daily-progress/day14.md): Upgraded test file & refactored code, added GAS, LOG Opcodes
- [x] [Day 15](./daily-progress/day15.md): Major EVM class refactoring & started CALL Opcode
- [x] [Day 16](./daily-progress/day16.md): Final CALL implementation & RETURNDATASIZE, RETURNDATACOPY Opcodes
- [x] [Day 17](./daily-progress/day17.md): Opcode runners refactoring, DELEGATECALL, STATICCALL Opcodes
- [x] [Day 18](./daily-progress/day18.md): CREATE, SELFDESTRUCT Opcodes. Challenge completed!

## Running the EVM locally

Get started by cloning the repo and installing the node dependencies:

```bash
git clone https://github.com/nicolas-racchi/evm-from-scratch.git
cd evm-from-scratch
yarn
```

I added a command-line script to allow running the EVM with a simple command. If you want to run simple bytecode input (without passing any transaction data or block data), you can use the following command:

```bash
yarn start:bytecode <your-bytecode-input>

# example:
yarn start:bytecode 604260005260206000F3
```

If you want to provide additional runtime data, you can use the [input.json](./evm-from-scratch-challenge/input.json) file in the root directory as a template for the expected input format. You can then run the file content with the following command:

```bash
yarn start:file input.json
```

The program will output the step-by-step execution in a `logs` folder in the root directory.

## Running tests

This command will run all challenge-related tests:

```bash
yarn test
```

## Credits

- [W1nt3r.eth](https://twitter.com/w1nt3r_eth) for creating the [EVM From Scratch](https://github.com/w1nt3r-eth/evm-from-scratch) challenge.
