class InvalidArgumentException extends Error {
	constructor(message) {
		super()
		this.message = message
		this.name = "InvalidArgumentException"
	}
}

module.exports = InvalidArgumentException