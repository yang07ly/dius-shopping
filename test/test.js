/* global describe, it */

const assert = require('assert')
const Rule = require('../src/rule.js')
const Checkout = require('../src/checkout.js')
const Product = require('../src/product.js')
const InvalidArgumentException = require('../src/error.js')
const exp = require('chai').expect

describe('Dius Coding Challenge', () => {
  // 3 for 2 deal on Apple TVs
  const rule1 = new Rule('atv', 3, 'atv',
    'percent', 1, 1)
  // bulk discount of $50 for more than 4 iPads
  const rule2 = new Rule('ipd', 5, 'ipd',
    'abs', 50, 'all')
  // free VGA for every MacBook Pro
  const rule3 = new Rule('mbp', 1, 'vga',
    'percent', 1, 1)
  const ipd = new Product('ipd', 'Super iPad', 549.99)
  const mbp = new Product('mbp', 'MacBook Pro', 1399.99)
  const atv = new Product('atv', 'Apple TV', 109.5)
  const vga = new Product('vga', 'VGA adapter', 30)

  it('1. Success story - 3 atv, 1 vga', () => {
    const co = new Checkout([rule1, rule2, rule3])
    co.scan(atv)
    co.scan(atv)
    co.scan(atv)
    co.scan(vga)

    const expect = 249
    const actual = co.total()
    assert.strictEqual(actual, expect)
  })

  it('2. Success story - 2 atv, 5 ipd', () => {
    const co = new Checkout([rule1, rule2, rule3])
    co.scan(atv)
    co.scan(ipd)
    co.scan(ipd)
    co.scan(atv)
    co.scan(ipd)
    co.scan(ipd)
    co.scan(ipd)

    const expect = 2718.95
    const actual = co.total()
    assert.strictEqual(actual, expect)
  })

  it('3. Success story - mbp, vga, ipd', () => {
    const co = new Checkout([rule1, rule2, rule3])
    co.scan(mbp)
    co.scan(vga)
    co.scan(ipd)

    const expect = 1949.98
    const actual = co.total()
    assert.strictEqual(actual, expect)
  })

  it('4. Success story - all promos applied', () => {
    const co = new Checkout([rule1, rule2, rule3])
    co.scan(ipd)
    co.scan(ipd)
    co.scan(ipd)
    co.scan(ipd)
    co.scan(ipd)
    co.scan(mbp)
    co.scan(atv)
    co.scan(atv)
    co.scan(atv)
    co.scan(vga)

    const expect = 4118.94
    const actual = co.total()
    assert.strictEqual(actual, expect)
  })

  it('5. Success story - no promos applied', () => {
    const co = new Checkout([])
    co.scan(ipd)
    co.scan(ipd)
    co.scan(ipd)
    co.scan(ipd)
    co.scan(mbp)
    co.scan(atv)
    co.scan(atv)
    co.scan(atv)
    co.scan(vga)

    const expect = 3958.45
    const actual = co.total()
    assert.strictEqual(actual, expect)
  })

  it('6. Success story - no applicable promos', () => {
    const co = new Checkout([rule1, rule2])
    co.scan(atv)
    co.scan(atv)
    co.scan(mbp)
    co.scan(mbp)
    co.scan(mbp)
    co.scan(vga)
    co.scan(vga)
    co.scan(vga)
    co.scan(ipd)
    co.scan(ipd)

    const expect = 5608.95
    const actual = co.total()
    assert.strictEqual(actual, expect)
  })

  it('7. Success story - conflicting promos', () => {
    // buy an Apple TV and buy a VGA for 50% off
    const rule4 = new Rule('atv', 1, 'vga',
      'percent', 0.5, 1)
    const co = new Checkout([rule1, rule2, rule3, rule4])
    co.scan(atv)
    co.scan(vga)
    co.scan(mbp)

    const expect = 1509.49
    const actual = co.total()
    assert.strictEqual(actual, expect)
  })

  // refer to README for a detailed explanation of this test case
  it('8. Success story - conflicting promos', () => {
    // 10% off for Apple TV
    const rule4 = new Rule('atv', 1, 'atv',
      'percent', 0.1, 1)
    const co = new Checkout([rule1, rule2, rule3, rule4])

    co.scan(atv)
    let expect = 98.55
    let actual = co.total()
    assert.strictEqual(actual, expect)

    co.scan(atv)
    expect = 197.10
    actual = co.total()
    assert.strictEqual(actual, expect)

    co.scan(atv)
    expect = 219
    actual = co.total()
    assert.strictEqual(actual, expect)

    co.scan(atv)
    expect = 317.55
    actual = co.total()
    assert.strictEqual(actual, expect)
  })

  it('9. Success story - more than 1 applicable promos', () => {
    // buy a MacBook Pro and get an iPad for free
    const rule4 = new Rule('mbp', 1, 'ipd',
      'percent', 1, 1)
    const co = new Checkout([rule1, rule2, rule3, rule4])
    co.scan(ipd)
    co.scan(vga)
    co.scan(mbp)

    const expect = 1399.99
    const actual = co.total()
    assert.strictEqual(actual, expect)
  })

  // refer to README for a detailed explanation of this test case
  it('10. Success story - more than 1 applicable promos', () => {
    // 10% off for Macbook Pro
    const rule4 = new Rule('mbp', 1, 'mbp',
      'percent', 0.1, 1)
    // 20% off for VGA
    const rule5 = new Rule('vga', 1, 'vga',
      'percent', 0.2, 1)
    const co = new Checkout([rule1, rule2, rule3, rule4])
    co.scan(vga)
    co.scan(mbp)

    const expect = 1259.99
    const actual = co.total()
    assert.strictEqual(actual, expect)
  })

  it('11. Error handling - invalid product', () => {
    exp(() => {
      const iphone = new Product('ipn', 'iPhone', '549.99')
    }).to.throw(InvalidArgumentException)
  })

  it('12. Error handling - invalid promo', () => {
    exp(() => {
      const rule = new Rule('atv', 3, 'atv',
        'percent', 1, 'none')
    }).to.throw(InvalidArgumentException)
  })
})
