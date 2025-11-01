import { test } from '@deno/shim-deno-test'

declare global {
  namespace Deno {
    export { test }
  }
}
