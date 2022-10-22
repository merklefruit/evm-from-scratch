import runners from "./runners"

export function getOpcodeNameFromHex(hex: number): string {
  return runners[hex]?.name
}

export function getOpcodeHexFromName(name: string): number {
  for (const [hex, { name: opcodeName }] of Object.entries(runners)) {
    if (opcodeName === name) return parseInt(hex)
  }

  throw new Error(`Opcode ${name} not found`)
}

export function getImplementedOpcodes(): string[] {
  return Object.values(runners).map((r) => r.name)
}
