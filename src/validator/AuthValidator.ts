const BaseValidator = require('./BaseValidator')
const { role } = require('../config/auth')
const validator = require('validator')

export default class AuthValidator extends BaseValidator {

  // type check
  rules = [
    'username|string|required|allowNull',
    'password|string|required',
    'role_id|number|required',
  ]

  constructor (params: any) {
    super()
    this.params = params
  }

  checkAuthParam (): Boolean {
    if (!this.checkParams(this.params, this.rules)) return false
    const { role_id } = this.params
    if (role_id == role.HOME_CUSTOMER) {
      const hRule = [
        'phone|string|required',
        'email|string|required',
        'marriage_status|number|required',
        'gender|number|required',
        'birth|number|required',
        'annual_income|number|allowNull',
        'street|string|required',
        'city|string|required',
        'state_id|number|required',
        'zip_code|number|required',
      ]
      return this.checkParams(this.params, hRule)
    } else if (role_id == role.BUSINESS_CUSTOMER) {
      const bRule = [
        'phone|string|required',
        'email|string|required',
        'name|string|required',
        'annual_income|number|allowNull',
        'street|string|required',
        'city|string|required',
        'state_id|number|required',
        'zip_code|number|required',
        'cate|number|required',
      ]
      return this.checkParams(this.params, bRule)
        && this.isShortName(this.params.name)
        && this.isPhone(this.params.phone)
        && this.isEmail(this.params.email)
    } else if (role_id == role.ADMIN) {
      const aRule = [
        'name|string|required',
      ]
      return this.checkParams(this.params, aRule) && this.isShortName(this.params.name)
    }
    return true
  }

  checkAccountParam (): Boolean {
    const aRule = [
      'username|string|required',
      'password|string|required',
    ]
    return this.checkParams(this.params, aRule) && this.params.password.length >= 6
  }

  checkUpdate (): Boolean {
    const { role_id } = this.params
    if (role_id == role.HOME_CUSTOMER) {
      const hRule = [
        'uid|number|required',
        'phone|string',
        'email|string',
        'marriage_status',
        'gender|number',
        'birth|number',
        'annual_income|number',
        'street|string',
        'city|string',
        'state_id|number',
        'zip_code|number',
      ]
      return this.checkParams(this.params, hRule)
        && (!this.params.phone || this.isPhone(this.params.phone))
        && (!this.params.email || this.isEmail(this.params.email))
    } else if (role_id == role.BUSINESS_CUSTOMER) {
      const bRule = [
        'uid|number|required',
        'phone|string',
        'email|string',
        'name|string',
        'annual_income|number',
        'street|string',
        'city|string',
        'state_id|number',
        'zip_code|number',
        'cate|number',
      ]
      return this.checkParams(this.params, bRule)
        && (!this.params.name || this.isShortName(this.params.name))
        && (!this.params.phone || this.isPhone(this.params.phone))
        && (!this.params.email || this.isEmail(this.params.email))
    } else if (role_id == role.ADMIN) {
      const aRule = [
        'uid|number|required',
        'name|string|required',
      ]
      return this.checkParams(this.params, aRule) && this.isShortName(this.params.name)
    }
    return false
  }

  // check if username is valid
  checkUsername (): Boolean {
    const uRule = [
      'username|string|required',
    ]
    return this.checkParams(this.params, uRule)
  }

  checkInfo (): Boolean {
    const iRule = [
      'uid|number|required',
    ]
    return this.checkQuery(this.params, iRule)
  }

  goCheck (): Boolean {
    return this.checkParams(this.params, this.rules)
  }
}
