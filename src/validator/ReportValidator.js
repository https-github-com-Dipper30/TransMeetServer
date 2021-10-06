const BaseValidator = require("./BaseValidator")
const validator = require('validator')

class ReportValidator extends BaseValidator {

  // type check
  rules = ['user_id|number|required', 'type|number|required', 'descriptions|string|required']

  constructor (params) {
    super()
    this.params = params
  }

  goCheck () {
    return this.checkParams(this.params, this.rules)
  }
}

module.exports = ReportValidator
