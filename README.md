# DIUS Coding Challenge


## Introduction

This is a solution to [DiUS Coding Challenge - Computer Store](https://github.com/DiUS/coding-tests/blob/master/dius_shopping.md). It is a checkout system written in NodeJS that takes in a list of pricing rules, scans the product, computes the applicable promotions and discounts, and outputs a total price. For information about the sample usage, refer to `test/test.js`.


## Author

Done by Yang Lu (yang07ly@gmail.com).


## Requirements

- npm >= 6
- node >= 12


## Setup

```
npm install
```


## Usage

To use the Checkout system, simply import via

```
const Rule = require('../src/rule.js')
const Checkout = require('../src/checkout.js')
const Product = require('../src/product.js')
```


## Assumptions on Pricing Rules

Every item can be applied with only one promotion. When there are more than 1 applicable promotions for an item, the promotion that results in more discount will apply. This rule does not apply to items bought at regular price.

Example 1.

Promotions
1. 10% off for iPad
2. 3 iPads for the price of 2. 

Scenario
1. If a customer buys 1 iPad, then Promotion 1 applies to that iPad.
2. If a customer buys 2 iPads, then Promotion 1 applies to both iPads.
3. If a customer buys 3 iPads, then Promotion 2 applies to the 3 iPads. Promotion 1 no longer applies here.
4. If a customer buys 4 iPads, then Promotion 2 applies to the first 3 iPads whereas Promotion 1 applies to the 4th iPad.

For details on this example, refer to Test Case 8 in `test/test.js`.

Example 2. 

Promotions
1. 10% off for MacBook Pro
2. Free VGA for every Macbook Pro bought.
3. 20% off for VGA

Scenario
1. If a customer buys 1 Macbook Pro, then only Promotion 1 and 2 apply. Promotion 1 applies to the MacBook Pro because the Macbook Pro was baught at regular price. Promotion 2 applies to the VGA because the MacBook Pro was bought. Promotion 3 does not apply because it conflicts with Promotion 2. Since Promotion 2 results in more discount and less total price, Promotion 2 applies instead of Promotin 3.

For details on this example, refer to Test Case 10 in `test/test.js`.


## Data Representation

### Product

A product in this program consists of 3 parameters
- SKU (`sku`)
- Name (`name`)
- Price (`price`)

For validation rules on these 3 parameters, refer to `src/product.js`.

### Promotion

A promotion in this program consists of 6 parameters
- Base SKU (`base_sku`). This is the SKU of the product that triggers the promotion.
- Base Quantity (`base_qty`. This is the minimum number of the products that a customer needs to buy to get the promotion.
- Promotion SKU (`promo_sku`). This is the SKU of the product that will be applied with the promotion.
- Promotion Value Type (`promo_val_type`). This is the type of the promotion discount. It consists of two types:
	- Absolute (`abs`). The absolute amount.
	- Percentage (`percent`). The percentage amount relative to the price of the product on promotion.
- Promotion Value Amount (`promo_val_amt`). This is the amount of promotion.
- Promotion Quantity (`promo_qty`). This is the number of products on promotion bought by a customer that will be applied with the promotion. There are two types:
	- All (`all`). It means all products of `promo_sku` bought by a customer will be applied with the promotion.
	- A positive integer (e.g. `2`). It means a given number of products of `promo_sku` bought by a customer will be applied with the promotion.

Example 1. 3 for 2 deal on Apple TV
```
const rule = {
	base_sku: 'atv',
	base_qty: 3,
	promo_sku: 'atv',
	promo_val_type: 'percent',
	promo_val_amt: 1,
	prodo_qty: 1
}
```

Example 2. The brand new Super iPad will have a bulk discounted applied, where the price will drop to $499.99 each, if someone buys more than 4
```
const rule = {
	base_sku: 'ipd',
	base_qty: 5,
	promo_sku: 'ipd',
	promo_val_type: 'abs',
	promo_val_amt: 50,
	prodo_qty: 'all'
}
```

Example 3. A VGA adapter free of charge with every MacBook Pro sold
```
const rule = {
	base_sku: 'mbp',
	base_qty: 1,
	promo_sku: 'vga',
	promo_val_type: 'percent',
	promo_val_amt: 1,
	prodo_qty: 1
}
```

For validation rules on these parameters, refer to `src/rule.js`.
