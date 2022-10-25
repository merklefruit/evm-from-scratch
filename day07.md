# Day 7

The first week is up!

I can say that I'm very happy about the results so far. I've learned a ton about the internal workings of the Ethereum protocol in general – not only the EVM. I've had a chance to look at client software, to read the yellow paper, and to brainstorm my way through some of the more important parts of the execution model.

---

Enough talk, let's get to what I did today: it was finally time to implement the **Memory** structure! I had a draft model of this which I did a few days ago (on Day 4 to be precise). It turns out what I did was way too simple and bugged, so I had to basically rewrite it completely.

I learned how to manipulate Buffers in javascript - and I'm surprised as to how flexible and reliable they are. I also learned how MSTORE and MLOAD work. In particular I created a generic `write` function in the memory, which takes a `size` argument that can be either 1 or 32 depending on how many bytes I want to write into memory.

I didn't know how the memory layout actually works, and how it expands dynamically based on where someone is trying to access it. Now I know why accessing memory which is "far away" is more expensive: you pay for each 32-byte word expansion that happens to get there.

MLOAD also gave me some trouble because I couldn't figure out how to read a single byte on the tail (with something like a PUSH1 31 hex and then MLOAD). Nonetheless, solving it has been rewarding as always, thanks to the tests provided by this challenge.
