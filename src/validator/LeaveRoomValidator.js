const BaseValidator = require("./BaseValidator")
const validator = require('validator')

class LeaveRoomValidator extends BaseValidator {

  // type check
  rules = ['room_id|number', 'user_id|number|required']

  constructor (params) {
    super()
    this.params = params
  }

  goCheck () {
    return this.checkParams(this.params, this.rules)
  }
}

module.exports = LeaveRoomValidator
