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
  ]

  constructor (params: any) {
    super()
    this.params = params
  }

  goCheck (): Boolean {
    // if the staff is not a region manager, he/she must have a store_assigned value
    return this.checkParams(this.params, this.rules) 
    && this.isPositiveInteger(this.params.price)
    && this.isBetween(this.params.cate, 1, 6)
    && this.isBetween(this.params.type, 1, 36)
  }

  checkUpdate (): Boolean {
    const uRule = [
      'id|number|required',
      'name|string|required',
      'amount|number|required',
      'price|number|required',
      'cate|number|required',
      'type|number|required',
      'description|string',
    ]
    return this.checkParams(this.params, uRule)
    && this.isPositiveInteger(this.params.id)
    && this.isPositiveInteger(this.params.price)
    && this.isBetween(this.params.cate, 1, 6)
    && this.isBetween(this.params.type, 1, 36)
  }

  checkGetImage (): Boolean {
    const iRule = [
      'id|number',
    ]
    return this.checkQuery(this.params, iRule) && this.isPositiveInteger(this.params?.id)
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
      'name|string',
      'cate|number|allowNull',
      'type|number|allowNull',
      'pid|number|allowNull',
      'sid|number|allowNull',
      'price|number|allowNull',
      'listed|boolean|allowNull',
      'available|boolean|allowNull',
      'pic|boolean',
      'page|number',
      'size|number',
      'showStores|boolean',
      'sort|string',
    ]
    return this.checkQuery(this.params, gRule)
  }

}
