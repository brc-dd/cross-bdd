// @ts-check

/**
 * @typedef {Object} SuiteCtx
 * @property {import('@deno/shim-deno-test').TestContext} t
 * @property {Array<() => Promise<void>>} queue
 */

/** @type {Array<SuiteCtx>} */
const ctxStack = []
let specDepth = 0

/**
 * @returns {SuiteCtx}
 */
function currentCtx() {
  const ctx = ctxStack[ctxStack.length - 1]
  if (!ctx) throw new Error('No active suite context.')
  return ctx
}

/**
 * @param {SuiteCtx} ctx
 * @returns {Promise<void>}
 */
async function runQueueSequentially(ctx) {
  for (const run of ctx.queue) {
    await run()
  }
}

/**
 * @template T
 * @param {SuiteCtx} ctx
 * @param {() => Promise<T>} run
 * @returns {Promise<T>}
 */
async function withCtx(ctx, run) {
  ctxStack.push(ctx)
  try {
    const result = await run()
    await runQueueSequentially(ctx)
    return result
  } finally {
    ctxStack.pop()
  }
}

/**
 * @param {'describe' | 'it'} caller
 */
function assertNotInSpec(caller) {
  if (specDepth > 0) {
    throw new Error(
      `Cannot call ${caller}() inside an it() body. ` +
        `Move it to a describe() block or schedule it as its own test.`
    )
  }
}

/**
 * @param {string} name
 * @param {() => void | Promise<void>} body
 * @returns {void}
 */
export function describe(name, body) {
  assertNotInSpec('describe')
  const inSuite = ctxStack.length > 0
  if (!inSuite) {
    // prettier-ignore
    /** @type {{ Deno: typeof import('@deno/shim-deno-test') }}*/ (/** @type {unknown}*/ (globalThis))
    .Deno.test(name, async (t) => {
      const root = { t, queue: [] }
      await withCtx(root, async () => {
        await body()
      })
    })
  } else {
    const parent = currentCtx()
    parent.queue.push(async () => {
      await parent.t.step(name, async (t2) => {
        const child = { t: t2, queue: [] }
        await withCtx(child, async () => {
          await body()
        })
      })
    })
  }
}

/**
 * @param {string} name
 * @param {() => void | Promise<void>} body
 * @returns {void}
 */
export function it(name, body) {
  assertNotInSpec('it')
  const ctx = currentCtx()
  ctx.queue.push(async () => {
    await ctx.t.step(name, async () => {
      specDepth++
      try {
        await body()
      } finally {
        specDepth--
      }
    })
  })
}
