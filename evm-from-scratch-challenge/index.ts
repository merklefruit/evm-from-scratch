#!/usr/bin/env node

import fs from "fs"
import yargs from "yargs/yargs"

import EVM from "./src/evm"
import { parsers } from "./src/opcodes/utils"
import { buildBlock, buildState, buildTxData, validateInputFile } from "./src/utils"

async function main() {
  const argv = await yargs(process.argv.slice(2)).options({
    bytecode: { type: "string", demandOption: false },
    file: { type: "string", demandOption: false },
    debug: { type: "boolean", default: false },
    saveLogs: { type: "boolean", default: true },
  }).argv

  if (!argv.bytecode && !argv.file)
    throw new Error("Please provide either a bytecode or file flag")

  if (argv.bytecode && argv.file)
    throw new Error("Please specify either bytecode or file input, not both")

  if (argv.bytecode) {
    console.log("Running specified bytecode...")

    const evm = new EVM({
      debug: argv.debug,
      saveLogs: argv.saveLogs,
      _code: parsers.hexStringToUint8Array(argv.bytecode),
    })

    const result = await evm.run()

    console.log("Execution complete")
    console.log("Result:\n", result)
  }

  if (argv.file) {
    console.log("Running from file input...")

    const file = fs.readFileSync(argv.file, "utf8")
    const options = JSON.parse(file)

    if (!validateInputFile(options))
      throw new Error("Invalid EVM input JSON. Please see README for more information.")

    const _code = parsers.hexStringToUint8Array(options.code.bin)
    const _asm = options.code.asm
    const _txData = buildTxData(options.txData)
    const _globalState = buildState(options.globalState)
    const _block = buildBlock(options.block)

    const evm = new EVM({
      debug: argv.debug,
      saveLogs: argv.saveLogs,
      _code,
      _asm,
      _txData,
      _globalState,
      _block,
    })

    const result = await evm.run()

    console.log("Execution complete")
    if (argv.saveLogs) console.log("Logs saved to:", result.logsFile)
    console.log("Result:\n", result)
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
