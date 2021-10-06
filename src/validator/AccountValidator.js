const BaseValidator = require("./BaseValidator")
const validator = require('validator')

class AccountValidator extends BaseValidator {

  // type check
  rules = ['username|string|required', 'password|string|required', 'name|string|allowNull', 'grade|number|allowNull', 'school|number|allowNull']

  constructor (params) {
    super()
    this.params = params
  }

  goCheck () {
    const valid = this.checkParams(this.params, this.rules)
    if ( !valid ) return false
    const { password } = this.params
    if ( password.length < 6 ) return false
    return true
  }
}

module.exports = AccountValidator