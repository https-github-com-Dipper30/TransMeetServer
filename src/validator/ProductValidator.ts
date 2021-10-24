const BaseValidator = require('./BaseValidator')
import { jobTitle } from '../config/common'

export default class ProductValidator extends BaseValidator {

  // type check
  rules = [
    'name|string|required',
    'amount|number|required',
    'price|number|required',
    'cate|number|required',
    'type|number|required',
    'description|string',
    'listTS|unixTimestamp|required|allowNull',
    'createTS|unixTimestamp|required',
    'imgSrc|string|allowNull',
  ]

  constructor (params: any) {
    super()
    this.params = params
  }

  goCheck (): Boolean {
    // if the staff is not a region manager, he/she must have a store_assigned value
    return this.checkParams(this.params, this.rules) 
    && this.isPositiveInteger(this.params.price)
  }

  checkList (): Boolean {
    const lRule = [
      'pid|number|required',
      'sid|array|required',
    ]
    if(!this.checkParams(this.params, lRule)) return false
    for (let i of this.params.sid || []) {
      if (typeof i != 'number') return false
    }
    return true
  }

  checkUnlist (): Boolean {
    const uRule = [
      'pid|number|required',
    ]
    return this.checkParams(this.params, uRule) && this.isPositiveInteger(this.params.pid)
  }

  checkDelete (): Boolean {
    const uRule = [
      'pid|number|required',
    ]
    return this.checkParams(this.params, uRule) && this.isPositiveInteger(this.params.pid)
  }

  checkGet (): any {
    const gRule = [
      'cate|number|allowNull',
      'type|number|allowNull',
      'pid|number|allowNull',
      'sid|number|allowNull',
      'price|number|allowNull',
      'listed|boolean|allowNull',
      'available|boolean|allowNull',
    ]
    return this.checkQuery(this.params, gRule)
  }

}
