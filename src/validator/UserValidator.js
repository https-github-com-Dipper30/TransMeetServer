const BaseValidator = require("./BaseValidator")
const validator = require('validator')

class UserValidator extends BaseValidator {

  // type check
  rules = ['name|string|required|allowNull', 'gender|number|required']

  constructor (params) {
    super()
    this.params = params
  }

  goCheck () {
    return this.checkParams(this.params, this.rules)
  }
}

module.exports = UserValidator