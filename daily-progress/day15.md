# Day 15

Today unfortunately was not a very fruitful day. I ended up spending way too much time on a code refactoring process in order to make the `CALL` instruction work. It was somewhat frustrating, because I had to change so much that worked perfectly up until now. Nonetheless, I will continue tomorrow and hopefully get the `CALL` Opcode working.

Among other things, the main refactoring was done to the `EVM` class itself: I now have a separate constructor and a `start()` function, which calls the `run()` handler with an instance of `MachineState`. So now I can create special opcode handlers for `CALL` and `CREATE` that will have the EVM class itself as parameter instead of only having access to the machine state. This is useful because during a `CALL` you are basically creating a new interpreter execution with the code of another contract and then return to the original execution.
