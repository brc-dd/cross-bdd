# cross-bdd

Cross-runtime testing helpers that map to the native test runners in Bun, Deno, and Node.js so your specs can stay portable.

## Why?

Every runtime ships its own standard library test runner with slightly different semantics. `cross-bdd` gives you a single `describe`/`it` pair that forwards to the familiar primitives in each environment, letting you share the same test suite without wrapping everything yourself.

## Installation

```bash
npm add -D cross-bdd
# or
pnpm add -D cross-bdd
# or
yarn add -D cross-bdd
# or
bun add -d cross-bdd
# or
deno add npm:cross-bdd
```

## Usage

```ts
// foo.test.ts

import { describe, it } from 'cross-bdd'

describe('math', () => {
  it('adds numbers', () => {
    const result = 2 + 2
    if (result !== 4) {
      throw new Error('Expected 4')
    }
  })

  it('supports async work', async () => {
    await new Promise((resolve) => setTimeout(resolve, 10))
  })
})
```

Then run your tests with the native test runner for your runtime:

```bash
# Bun
bun test
# Deno
deno test
# Node.js
node --test
```

## Notes

- Can be used with [`@std/assert`](https://jsr.io/@std/assert) or [`@std/expect`](https://jsr.io/@std/expect) for runtime-agnostic assertions.
- You can nest `describe` blocks as needed. Async `describe` bodies are supported.
- An opinionated reusable workflow is provided in the repo. To use it, create a workflow file in your own repo:

  ```yaml
  # .github/workflows/test.yaml
  name: Test

  on:
    push:
      branches: [main]
    pull_request:
      branches: [main]
      types: [opened, synchronize, reopened]
    workflow_dispatch:

  concurrency:
    group: ${{ github.workflow }}-${{ github.ref }}
    cancel-in-progress: true

  jobs:
    test:
      uses: brc-dd/cross-bdd/.github/workflows/test.reusable.yaml@main
      with:
        deno_versions: stable # remove this line to skip Deno testing
        bun_versions: latest # remove this line to skip Bun testing
        node_versions: 20 22 24 # remove this line to skip Node.js testing
  ```

## Credits

Takes inspiration from [`cross-org/test`](https://github.com/cross-org/test), [`cross-org/workflows`](https://github.com/cross-org/workflows), and [`@std/testing/bdd`](https://jsr.io/@std/testing/doc/bdd).

## Sponsors

<p align="center">
  <a href="https://cdn.jsdelivr.net/gh/brc-dd/static/sponsors.svg">
    <img alt="brc-dd's sponsors" src="https://cdn.jsdelivr.net/gh/brc-dd/static/sponsors.svg" />
  </a>
</p>
