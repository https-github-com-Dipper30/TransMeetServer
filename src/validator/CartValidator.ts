const BaseValidator = require('./BaseValidator')
const role = require('../config/auth')

export default class CartValidator extends BaseValidator {

  // type check
  rules = [
    'uid|number|required',
    'pid|number|required',
    'sid|number|required',
    'amount|number|required',
  ]

  constructor (params: any) {
    super()
    this.params = params
  }

  goCheck (): Boolean {
    return this.checkParams(this.params, this.rules)
    && this.isPositiveInteger(this.params.amount)
  }

  checkGet (): Boolean {
    const gRule = [
      'uid|number|required',
    ]
    return this.checkQuery(this.params, gRule)
  }

  checkIsInCart (): Boolean {
    const iRule = [
      'uid|number|required',
      'pid|number|required',
      'sid|number|required',
    ]
    return this.checkParams(this.params, iRule)
  }
}
