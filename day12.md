# Day 12

Time has finally come. Today is `Storage` day.

This is perhaps the most critical and complex part of the EVM execution itself.

- Where is the account storage coming from?
- How is data stored permanently on the blockchain?
- What exactly are storage checkpoints and how do they relate to gas costs?
- What are the abstractions from the data layer to the execution layer?

These are the questions I will try to answer today and in the coming days.

## Storage

For this challenge, we don't actually need to recreate anything remotely as complex as the real Ethereum storag (luckily) but I'd like to understand how it works since I'm already here.

The storage is a key-value store holding data about each account indexed by address. The data is stored in the form of 256-bit words. The storage is a part of the state of the blockchain and is updated by the transactions.

Now for the EVM-related part. The storage can be accessed in read and write operations. One does not actually need to load storage information about all addresses in the blockchain to execute a transaction, because only a small slice of storage might be accessed if at all.

[Here is a good article explaining how the storage works](https://medium.com/hackernoon/getting-deep-into-ethereum-how-data-is-stored-in-ethereum-e3f669d96033). 10/10 article, really amazing explanations. 0/10 for the background color though. I had to open it on Safari reader mode to read it. Whoever chose that color needs to be jailed ASAP.

## TL;DR and reading notes

The Ethereum protocol main data structure is a [Merkle Patricia Tree](https://ethereum.org/en/developers/docs/data-structures-and-encoding/patricia-merkle-trie/) (also read more [here](https://github.com/ethereum/wiki/wiki/Patricia-Tree) and ). Importantly, data inside this state trie are not stored directly in the blocks of the blockchain. What is stored on each block is simply the hash of the root of the state trie, transaction trie and receipts trie. This is a very important point to understand.

Here's a simple bird's eye view of what happens:

1. The storage trie keeps info about smart contract data storage slots and their values.
2. The root of that tree (storageRoot) is then kept in the State Trie which also tracks all the accounts state.
3. The root of the State Trie is (stateRoot) is set in the block header.
4. The same goes for the receipts trie (receiptsRoot) and the transaction trie (transactionsRoot).

### A closer look at the trie structure

There is one, and one only, global state trie in Ethereum. This global state trie is constantly updated.
**The state trie contains a key and value pair for every account which exists on the Ethereum network.**

- The "key" is a single 160 bit identifier (the address of an Ethereum account).
- The "value" in the global state trie is created by encoding the following account details of an Ethereum account (using the Recursive-Length Prefix encoding (RLP) method): `nonce`, `balance`, `storageRoot`, `codeHash`.

The state trie’s root node ( a hash of the entire state trie at a given point in time) is used as a secure and unique identifier for the state trie.

### Storage Trie: smart contract data storage

Each Ethereum account has its own Storage Trie. A hash of its root node is stored as the `storageRoot` in the global state trie explained above.

### Storage Tries at a software/hardware client level

Most Ethereum clients store the different tries in a key-value store called [LevelDB](https://github.com/google/leveldb).

LevelDB offers useful features such as automatic compression using `Snappy` (a Google-developed compression library) and a simple key-value interface.

LevelDB is a dependency of the most popular Eth clients such as go-ethereum, cpp-ethereum and pyethereum.

Interestingly, accounts in Ethereum are only added to the state trie once a transaction has taken place (in relation to that specific account). For example, just creating a new account using `geth account new` will not include that account in the state trie; even after many blocks have been mined. However, if a successful transaction (one which costs gas and is included in a mined block) is recorded against that account, then and only then will that account appear in the state trie.

---

This is all the time I have for today, and even if I didn't make any progress in the challenge, I've learned plenty of new concepts that I will try to simplify and implement in the coming days.
