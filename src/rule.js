const InvalidArgumentException = require('./error.js')

class Rule {
  constructor (base_sku, base_qty, promo_sku,
    promo_val_type, promo_val_amt, promo_qty) {
    this.validateParams(base_sku, base_qty, promo_sku,
      promo_val_type, promo_val_amt, promo_qty)
    this.base_sku = base_sku
    this.base_qty = base_qty
    this.promo_sku = promo_sku
    this.promo_val_type = promo_val_type
    this.promo_val_amt = promo_val_amt
    this.promo_qty = promo_qty
  }

  validateParams (base_sku, base_qty, promo_sku,
    promo_val_type, promo_val_amt, promo_qty) {
    if (typeof base_sku !== 'string') {
      throw new InvalidArgumentException(
        'Invalid Rule Base SKU')
    }
    if (typeof base_qty !== 'number' || isNaN(base_qty) ||
      base_qty < 0 || !Number.isInteger(base_qty)) {
      throw new InvalidArgumentException(
        'Invalid Rule Base Quantity')
    }
    if (typeof promo_sku !== 'string') {
      throw new InvalidArgumentException(
        'Invalid Rule Promo SKU')
    }
    switch (promo_val_type) {
      case 'abs':
        if (typeof promo_val_amt !== 'number' ||
          isNaN(promo_val_amt) ||
          promo_val_amt < 0) {
          throw new InvalidArgumentException(
            'Invalid Rule Promo Amount')
        }
        break
      case 'percent':
        if (typeof promo_val_amt !== 'number' ||
          isNaN(promo_val_amt) ||
          promo_val_amt < 0 ||
          promo_val_amt > 1) {
          throw new InvalidArgumentException(
            'Invalid Rule Promo Amount')
        }
        break
      default:
        throw new InvalidArgumentException(
          'Invalid Rule Promo Type')
    }
    if (promo_qty !== 'all') {
      if (typeof promo_qty !== 'number' ||
        isNaN(promo_qty) || promo_qty < 0 ||
        !Number.isInteger(promo_qty)) {
        throw new InvalidArgumentException(
          'Invalid Rule Promo Quantity')
      }
    }
  }
}

module.exports = Rule
