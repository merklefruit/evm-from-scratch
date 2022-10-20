# Day 2

Today I finally started implementing the EVM in Typescript. I started with the basics, such as the `EVM` class, starting to layout what the main components are going to be. To keep it simple, I have chosen to implement the interpreter directly in the EVM class, bypassing everything including the global state and any external data. For now, I just want some simple code that can read from a bytecode input and can start executing the instructions sequentially. Then I will focus on implementing the actual functions on the opcodes themselves, but this will require an initial implementation of the memory, storage and stack footprints. I will also need to start thinking about gas implications, and exactly when and how to include every component in the mix. Very exciting stuff ahead!

I am also debating if I should have a separate `Opcode` class, or keeping the opcodes as atomic as possible, with each one having a function that only takes the current state as input, and can change it accordingly.

---

That's all the time I have for today!
