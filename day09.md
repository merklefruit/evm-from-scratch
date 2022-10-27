# Day 9

Big day today. [W1nt3r](https://twitter.com/w1nt3r_eth) (the creator of the challenge I am doing here) tweeted about the possibility to join his private cohort of the "evm from scratch" challenge. As I am a big fan of his work, and I'm already involved in the challenge by myself, I decided to message him to join the small cohort of students who will be attending the challenge.

So I am happy to say that this challenge has **officially started** for me today! Even though I am more than 65% done already, I will still try to follow the activity and schedule, and most importantly I am looking forward to chatting with the other students – I actually am very thankful for the opportunity because I now have a place to learn with like-minded engineers and people with whom I share a strong passion. I am also looking forward to the feedback I will get from the other students, and I hope to be able to give some feedback as well.

---

Regarding the challenge itself, yesterday I left off at the `DIFFICULTY` Opcode, and today I started with some simple ones, like `GASLIMIT`, `GASPRICE`, `CHAINID` & `CALLVALUE`. All of these are pretty straightforward as no new data structures or big modifications are required, it was just a matter of creating the interfaces and the correct adapters to accept the new Context-related fields to the EVM class (for instance, the Block.gaslimit field).

Then I finally arrived to a more tricky one: `CALLDATALOAD`. This one is not so easy to work with, mainly because of how I am currently parsing the transaction calldata. I figured the most practical way to implement calldata would be with a bytecode string, which I then parsed as Buffer for ease of use. For this reason, I had to change the implementation of the Test interface to accomodate for this double possibility. Nothing too complex, but _I hate removing simplicity from my code_.

Here is the implementation of `CALLDATALOAD` that I finally came up with:

```typescript
function CALLDATALOAD(ms: MachineState) {
  // get the byte offset from the stack
  const offset = Number(ms.stack.pop());

  // get the calldata as a buffer starting from the offset position,
  // with max size of 32 bytes (or less if the calldata is smaller)
  const calldataWord = ms.txData.data.subarray(offset, offset + 32);

  // add padding to the calldata word if it is smaller than 32 bytes
  // by copying it to the start of a new 32-bytes buffer
  const calldataWordPadded = Buffer.alloc(32);
  calldataWord.copy(calldataWordPadded, 0, 0);

  // convert the calldata word to a bigint (safe because it is capped at 32 bytes)
  const res = parseBytesIntoBigInt(calldataWordPadded);

  // push the result to the stack
  ms.stack.push(res);
}
```

I am realizing just now that I should have put way more commented code blocks in these daily progress reports. I promise I'll try to do that more from now on.

This was the last Opcode for today!

P.S. Here is the point I'm at right now: _79 passed, 101 total_. So about 78% done!
