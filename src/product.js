const InvalidArgumentException = require('./error.js')

class Product {
  constructor (sku, name, price) {
    this.validateParams(sku, name, price)
    this.sku = sku
    this.name = name
    this.price = price
  }

  validateParams (sku, name, price) {
    if (typeof sku !== 'string') {
      throw new InvalidArgumentException('Invalid SKU')
    }
    if (typeof name !== 'string') {
      throw new InvalidArgumentException('Invalid name')
    }
    if (typeof price !== 'number' || isNaN(price) ||
      price < 0) {
      throw new InvalidArgumentException('Invalid price')
    }
  }
}

module.exports = Product
