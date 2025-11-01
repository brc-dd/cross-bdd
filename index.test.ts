import { describe, it } from 'cross-bdd'
import assert from 'node:assert'

describe('Sample Test Suite', () => {
  let assertionCount = 0

  it('should pass this test case', () => {
    assertionCount++
    assert.strictEqual(1 + 1, 2)
  })

  describe('Nested Test Suite', () => {
    describe('Even More Nested Suite', () => {
      it('should pass this deeply nested test case', () => {
        assertionCount++
        assert.strictEqual('hello'.toUpperCase(), 'HELLO')
      })
    })

    it('should pass this nested test case', () => {
      assertionCount++
      assert.deepStrictEqual(
        [1, 2, 3].map((x) => x * 2),
        [2, 4, 6]
      )
    })
  })

  it('should have the correct number of assertions', () => {
    assert.strictEqual(assertionCount, 3)
  })
})

describe('Async Test Suite', async () => {
  const i = await Promise.resolve(42)
  let assertionCount = 0

  it('should handle async operations', async () => {
    const result = await Promise.resolve(i * 2)
    assertionCount++
    assert.strictEqual(result, 84)
  })

  describe('Nested Async Suite', async () => {
    const j = await Promise.resolve(7)

    it('should handle nested async operations', async () => {
      const result = await Promise.resolve(i + j)
      assertionCount++
      assert.strictEqual(result, 49)
    })

    describe('Even More Nested Async Suite', async () => {
      const k = await Promise.resolve(3)

      it('should handle deeply nested async operations', async () => {
        const result = await Promise.resolve(i * j * k)
        assertionCount++
        assert.strictEqual(result, 882)
      })
    })
  })

  it('should have the correct number of assertions after async tests', () => {
    assert.strictEqual(assertionCount, 3)
  })
})
