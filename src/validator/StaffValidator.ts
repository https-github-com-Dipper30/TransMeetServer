const BaseValidator = require("./BaseValidator")
import { jobTitle } from '../config/common'
const role = require('../config/auth')
const validator = require('validator')

export default class StaffValidator extends BaseValidator {

  // type check
  rules = [
    'name|string|required',
    'job_title|number|required',
    'store_assigned|number|allowNull',
    'region_assigned|number|required',
    'salary|number|required',
  ]

  constructor (params: any) {
    super()
    this.params = params
  }

  goCheck (): Boolean {
    // if the staff is not a region manager, he/she must have a store_assigned value
    return this.checkParams(this.params, this.rules) 
    && [(this.params.job_title != jobTitle.REGION_MANAGER && this.params.store_assigned)
    || this.params.job_title == jobTitle.REGION_MANAGER ]
  }
}
