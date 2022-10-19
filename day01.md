# day 1

Today I collected a few resources that will be useful along the way, mainly focusing on existing reference EVM implementations in different languages as well as some generic (non ethereum-specific) stack-based VMs. I also started reading chapter 13 of Mastering Ethereum in detail.

## Official EVM implementations from Eth clients

- [go-ethereum](https://github.com/ethereum/go-ethereum/blob/master/core/vm/evm.go): Go
- [py-evm](https://github.com/ethereum/py-evm): Python
- [evmone](https://github.com/ethereum/evmone): C++
- [ethereumjs-evm](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/evm): Typescript
- [akula-evm](https://github.com/akula-bft/akula/tree/master/src/execution/evm): Rust (WIP!)

## Generalized stack-based VM implementations in different languages (found on Github)

- [rooster](https://github.com/BranislavLazic/rooster): Go
- [stack-vm-tutorials](https://github.com/pbohun/stack-vm-tutorials): C++
- [stackVM](https://github.com/JLWalsh/StackVM): C
- [microvm](https://github.com/Prishvin/microvm): C
- [tinyvm](https://github.com/mkhan45/tinyvm): Rust
- [stack-VM](https://github.com/NishanthSpShetty/Stack-VM): Rust
- [crianza](https://github.com/cslarsen/crianza): Python

## Mastering Ethereum chapter 13: The EVM

The EVM is a computation engine similar to interpreters of other bytecode-compiled languages such as Java. When you want to run a Java program, you have to compile it first. Then you can run the compiled bytecode on the Java Virtual Machine (JVM). The term **virtual machine** here refers to the fact that the evm software is independent of the underlying hardware. It is a software abstraction that allows you to run the same program on different hardware architectures.

Moreover, the domain in which the EVM operates is much more limited than what is usually meant by the word virtual machine. For instance, there is no scheduling capability because transaction ordering is offloaded to the Ethereum clients. The same can be said for other parts such as system interface handling, external hardware support, etc.

This is important because Ethereum is a decentralized network of computers all over the world. The EVM is the software that allows these computers to run the same program and obtain the same output deterministically, even though they might have different hardware architectures.

The EVM is also a quasi-Turing-complete state machine. The keyword "quasi" aims to the fact that all execution processes are limited to a finite number of computational steps by the amount of gas "budget" they have. This is a security measure to prevent infinite loops from consuming all the available resources of the network.

Other than the **stack**, each transaction execution context has different data components: the volatile **memory** which is zero-initialized on each transaction, the **code** where the smart contract bytecode is stored upon deployment and is immutable, the permanent **storage** that is part of the global Ethereum state, as well as some **environmental** data such as the **blockchain context** (block number, timestamp, difficulty, gas limit, etc) and the **transaction context** (sender, recipient, value, gas price, etc).

The execution context isn't the only slice of state that is managed by the EVM. The job of the EVM is to ultimately update the global Ethereum state one transaction at a time. Here's how the Ethereum state works:

- the top level is the **world state** which is a key-value store that maps addresses to accounts. Each 160-bit address is associated with an **account** comprised of an ether balance, a nonce, the storage (only used by smart contract addresses), and the program code (also only used by smart contract addresses). An EOA (externally-owned account) will always have no code and an empty storage.

If a user transfers ETH to another user, there is no need to involve the EVM at all. The transaction will simply update the balance of the sender and the recipient in the world state. However, if a user wants to interact with a smart contract, the EVM is instantiated with all the information required in relation to the specific transaction being created. The transaction will also update the storage and the code of the smart contract account.

If a transaction fails during the EVM execution, all the state changes are reverted and the transaction is not included in the blockchain. It's easier to think of Ethereum clients running the EVM in a sandbox environment where the state changes are only committed if the transaction is successful.
