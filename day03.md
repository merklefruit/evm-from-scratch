# Day 3

Today I have read a portion of the yellow paper. I am interested the official names for specific functions, aswell as implementation guidelines. Before reading this document, I somehow thought that it would be a lot longer than what it actually is. It's only 41 pages, most of which are part of the appendix. There are way more implementation choices left to the developers than I initially anticipated, which is probably a good thing for the Ethereum protocol in terms of client diversity, flexibility and innovation.

Other than that, I tried to proceed with my EVM by writing some extremely simple classes. Most of the work is going to be actually understanding how to represent the global state and the machine state correctly in the interpreter.

## EVM Inception

Apparently, since the EVM is turing-complete if you remove the gas constraints, it's possible to build an EVM inside the EVM... There are already a few implementations of this I found online:

- [ricmoo/lurch](https://github.com/ricmoo/lurch)
- [ohalo-ltd/solevm](https://github.com/Ohalo-Ltd/solevm)
- [brockelmore/solvm](https://github.com/brockelmore/solvm)

Maybe something like this would be fun for a future challenge! I imagine it would be a lot easier once I have implemented it in at least one other language before.
