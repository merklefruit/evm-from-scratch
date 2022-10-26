# Day 8

Today I started with the `SHA3` Opcode. The Evm-from-scratch challenge I'm following says that you are allowed to use external libraries for hash functions, so I installed the `ethereum-crypto` package as it seems like a well-maintained library and with not too many dependencies and overall bloat. It implements KECCAK256 out of the box so plugging it in has been pretty effortless.

Now comes the interesting part: the tests at this point start having more information regarding the execution context: transaction data, block data, and so on. So I had to make changes to the EVM class to accomodate for these new items.

In particular, I started with the `tx` object, which can contain info such as the address of the origin EOA, the caller account, and the current execution address. I learned how these fields interact with each other when some of them are not specified, for instance the `tx.origin` is set to the `tx.from` if not specified to the EVM context, and will fallback to the Zero address.

I also had to implement pieces of code relative to the test suite, because in the real client integration you would have a database constisting of the global state, whereas in this challenge the tests can contain specific global state slices. I can say that as of now, the part of how the client stores and loads global state info is obscure to me, but maybe I will have time to dig into it in the later stages of this challenge.

After setting up the general infrastructure, I implemented some `Txdata` and `Block`-related Opcodes.

Finally, I arrived to a test of the `DIFFICULTY` Opcode. This one has been deprecated with the Merge hardfork, which was the one I was using as reference on <https://evm.codes> today, which had me confused at first because I didn't find it. I had to switch to the previous hardfork to find it.

Hardforks are another aspect that I haven't spent any time thinking about during this challenge. I know that many opcodes have been added with EIPs and subsequent hardforks, so a good EVM implementation (that isn't done for learning purposes like mine) should have a way to handle these recurring updates with ease. Nonetheless, I will try to think about them while writing my code, so that maybe one day I can revisit it to expand the support for this functionality.
