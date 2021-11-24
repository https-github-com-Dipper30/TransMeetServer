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

  checkUpdate (): Boolean {
    const uRule = [
      'id|number|required',
      'amount|number',
      'selected|boolean',
    ]
    return this.checkParams(this.params, uRule)
  }

  checkDelete (): Boolean {
    const dRule = [
      'id|number|required',
    ]
    return this.checkParams(this.params, dRule)
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
