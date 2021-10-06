const BaseValidator = require("./BaseValidator")
const validator = require('validator')

class AccountValidator extends BaseValidator {

  // type check
  rules = ['user_id|number|required', 'set_time|number|required', 'title|string|required', 'desc|string']

  constructor (params, rules) {
    super()
    this.params = params
    if (rules) this.rules = rules
  }

  goCheck () {
    const valid = this.checkParams(this.params, this.rules)
    if ( !valid ) return false
    const { set_time } = this.params
    if ( !this.isUnixTimeStamp(set_time) ) return false
    return true
  }
}

module.exports = AccountValidator