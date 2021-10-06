const BaseValidator = require("./BaseValidator")

class RoomValidator extends BaseValidator {

  // type check
  rules = ['name|string|required', 'owner_id|number|required', 'password|string|allowNull', 'volume|number|allowNull']

  constructor (params) {
    super()
    this.params = params
  }

  goCheck () {
    return this.checkParams(this.params, this.rules)
  }
}

module.exports = RoomValidator