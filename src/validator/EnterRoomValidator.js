const BaseValidator = require("./BaseValidator")
const validator = require('validator')

class EnterRoomValidator extends BaseValidator {

  // type check
  rules = ['room_id|number|required', 'user_id|number|required', 'password|string|allowNull']

  constructor (params) {
    super()
    this.params = params
  }

  goCheck () {
    return this.checkParams(this.params, this.rules)
  }
}

module.exports = EnterRoomValidator