declare function describe(name: string, body: () => void | Promise<void>): void
declare function it(name: string, body: () => void | Promise<void>): void

export { describe, it }
