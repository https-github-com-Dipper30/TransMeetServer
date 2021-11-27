const BaseValidator = require('./BaseValidator')
const role = require('../config/auth')
const validator = require('validator')

export default class OrderValidator extends BaseValidator {

  // type check
  rules = [
    'uid|number|required',
    'totalPrice|number|required',
    'time|timestamp|required',
  ]

  constructor (params: any) {
    super()
    this.params = params
  }

  goCheck (): Boolean {
    return this.checkParams(this.params, this.rules) && this.checkOrder(this.params?.orders)
  }

  checkOrder (orders: any[]): Boolean {
    if (!Array.isArray(orders)) return false
    const oRule = [
      'sid|number|required',
      'pid|number|required',
      'amount|number|required',
      'price|number|required',
    ]
    
    return orders.every(order => this.checkParams(order, oRule))
  }

  checkGet (): any {
    const gRule = [
      'uid|number',
      'oid|number',
      'sid|number',
      'pid|number',
      'rid|number',
      'price|number',
      'page|number',
      'size|number',
    ]
    return this.checkQuery(this.params, gRule)
  }
}
