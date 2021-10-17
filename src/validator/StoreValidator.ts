import { errCode } from "../config"
import { DatabaseException, ParameterException } from "../exception"

const BaseValidator = require("./BaseValidator")
const role = require('../config/auth')
const validator = require('validator')

export default class StoreValidator extends BaseValidator {

  // type check
  rules = [
    'manager_id|number|allowNull',
    'region_id|number|required',
    'name|string|required',
    'street|string|required',
    'city|string|required',
    'state_id|number|required',
    'zip_code|number|required',
  ]

  constructor (params: any) {
    super()
    this.params = params
  }

  goCheck (): Boolean {
    return this.checkParams(this.params, this.rules) && this.isZipCode(this.params?.zip_code)
  }

  checkGet (): any {
    const gRule = [
      'id|number|allowNull',
      'manager_id|number|allowNull',
      'region_id|number|allowNull',
      'state_id|number|allowNull',
    ]
    this.params = this.checkQuery(this.params, gRule)
    // if (!this.attrsAreIDs(this.params, ['id', 'manager_id', 'region_id', 'state_id'])) return new ParameterException(errCode.INVALID_ID)
    return this.params
  }

  checkSetManager (): Boolean {
    const sRule = [
      'manager_id|number|required',
      'store_id|number|required',
    ]
    return this.checkParams(this.params, sRule)
  }
}
