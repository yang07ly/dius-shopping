const priorityqueue = require('priorityqueue')

class Checkout {
	constructor(rules) {
		this.originalTotal = 0
		this.rules = rules
		this.cart = {}
		this.comparator = (a, b) => {
			if (a.discount > b.discount) {
				return 1
			} else if (a.discount < b.discount) {
				return -1
			} else {
				0
			}
		}
	}

	// update the cart and total price before discount
	scan(item) {
		const sku = item.sku
		if (this.cart[sku]) {
			this.cart[sku]["qty"]++
			this.cart[sku]["subtotal"] =
				this.cart[sku]["qty"] *
				this.cart[sku]["item"].price
		} else {
			this.cart[sku] = {
				item: item,
				qty: 1,
				subtotal: item.price
			}
		}
		this.originalTotal += item.price
	}

	// calculate the applicable discounts or promotions
	// and return the net sum
	total() {
		// we use a maximum priority queue
		// to always apply the rule with the most discount first
		const pq = new priorityqueue.BinaryHeap({
			comparator: this.comparator
		})
		this.rules.forEach(rule => {
			if (this.cart[rule.base_sku]) {
				const cartItem = this.cart[rule.base_sku]
				if (cartItem.qty >= rule.base_qty &&
					this.cart[rule.promo_sku]
				) {
					const promoItem = this.cart[rule.promo_sku]
					const discountQty = rule.promo_qty === 'all' ?
						cartItem.qty : rule.promo_qty
					let discountUnit = rule.promo_val_type === 'abs' ?
						rule.promo_val_amt :
						promoItem.item.price * rule.promo_val_amt
					discountUnit = round(discountUnit)
					if (discountUnit > promoItem.item.price) {
						discountUnit = promoItem.item.price
					}
					let count = promoItem.qty
					while (count >= rule.base_qty) {
						pq.push({
							rule: rule,
							discount: discountUnit * discountQty
						})
						count -= rule.base_qty
					}
				}
			}
		})
		// to enforce the rule that
		// if an item has been discounted or given as a gift,
		// this item cannot be applied with another promotion
		let counter = {}
		for (const sku in this.cart) {
			counter[sku] = this.cart[sku].qty
		}
		let discount = 0
		while (pq.length > 0) {
			const qualifiedRule = pq.pop()
			const promSku = qualifiedRule.rule.promo_sku
			if (counter[promSku] > 0) {
				discount += qualifiedRule.discount
				counter[promSku] -= qualifiedRule.rule.base_qty
			}
		}
		const total = this.originalTotal - discount
		return total
	}
}

// ensure two decimal precision for all mathematical operations
const round = num => Math.round(num * 100) / 100

module.exports = Checkout