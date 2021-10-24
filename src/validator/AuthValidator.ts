const BaseValidator = require('./BaseValidator')
const role = require('../config/auth')
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
        'name|string|required',
        'annual_income|number|allowNull',
        'street|string|required',
        'city|string|required',
        'state_id|number|required',
        'zip_code|number|required',
        'cate|number|required',
      ]
      return this.checkParams(this.params, bRule) && this.isShortName(this.params.name)
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
    return this.checkParams(this.params, aRule)
  }

  // check if username is valid
  checkUsername (): Boolean {
    const uRule = [
      'username|string|required',
    ]
    return this.checkParams(this.params, uRule)
  }

  goCheck (): Boolean {
    return this.checkParams(this.params, this.rules)
  }
}
