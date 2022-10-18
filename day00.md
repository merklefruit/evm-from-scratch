# Day 0

Ok here we goooooo

## EVM-specific material that I've gathered over time

- [ethereum.org](https://ethereum.org/en/developers/docs/evm/): a good first intro to the topic at hand. 
- [ethereum book chapter 13](https://github.com/ethereumbook/ethereumbook/blob/develop/13evm.asciidoc): reference explanation of the EVM. Solid resource.
- [evm.codes](https://evm.codes): interactive reference for each EVM opcode.
	- their [about section](https://evm.codes/about) has a general EVM overview which I found amazing.
	- their [EVM playground tool](https://www.evm.codes/playground) is an incredibly useful interactive debugger.
- [ethereum yellow paper](https://ethereum.github.io/yellowpaper/paper.pdf): this is the EVM bible, pretty much.
- [ethereum-js](https://github.com/ethereumjs/ethereumjs-monorepo): repo that contains the official Typescript EVM implementation.
- [evm from scratch series](https://karmacoma.notion.site/Building-an-EVM-from-scratch-series-90ee3c827b314e0599e705a1152eecf9): a Python implementation of the yellow paper.
- [crypto dev hub EVM tutorials](https://cryptodevhub.io/ethereum-virtual-machine-tutorials): this page might have useful resources, although most of these seem more production-oriented rather than low-level EVM.


## General Virtual Machine building material

- [building a virtual machine youtube series](https://www.youtube.com/watch?v=7pLCpN811tQ): graduate-level course on VMs.
- [a virtual machine from Crafting Interpreters](https://craftinginterpreters.com/a-virtual-machine.html): intricate low-level guide on stack-based virtual machines in C.
- [wikipedia stack machine article](https://en.wikipedia.org/wiki/Stack_machine): because the evm is not the first stack-based virtual machine (and not the last either).

## EVM Challenges
- [evm-from-scratch](https://github.com/w1nt3r-eth/evm-from-scratch): practical course that requires one to build their own EVM.


---

That's basically all the time I have for today.

My short-term roadmap is to explore a few of these resources until I find the one I like most, and then try to follow it to create a basic vm in typescript that passes the first few challenges of the evm-from-scratch course.