const BaseValidator = require("./BaseValidator")
const role = require('../config/auth')
const validator = require('validator')

export default class StoreValidator extends BaseValidator {

  // type check
  rules = [
    'manager_id|number|required|allowNull',
    'region_id|number|required',
    'name|string|required',
    'street|string|required',
    'city|string|required',
    'state_id|number|required',
    'zip_code|number|required'
  ]

  constructor (params: any) {
    super()
    this.params = params
  }

  goCheck (): Boolean {
    return this.checkParams(this.params, this.rules) && this.isZipCode(this.params?.zip_code)
  }
}
