# Day 4

Today I kept working on the initial setup, and I got the basic structure of the execution flow going. So far, I implemented the stack and a first version of the memory, and then implemented the first OPCODEs, namely STOP and ADD. I started working towards PUSH1, which requires a bit more setup than what I have going for now.

For the stack, I initially decided to use a `Buffer` array, but then I started writing the opcode runner functions, and I immediately noticed how inconvenient it would be because of how I need to manipulate the stack items. So I decided to rewrite the stack with a simple js `bigint` array, which will hold any value pushed into the stack just fine.

For the memory, I am using a single Buffer, allocating, reading and writing data directly onto it. I am not sure if this is the best approach but it makes sense for now. As I said, the implementation is still really simple so changing it later will be easy anyway.

I also added some utilities like an `ERRORS` enum.

That's all for today :D
