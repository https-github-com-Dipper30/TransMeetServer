import { errCode } from "../config/errCode"
import { Exception, ExceptionConfig } from "../types/common"

// Two ways to create an instance of a new Exception
// 1. new XXXException(code)
//    The [message] will be formed according to code
// 2. new XXXException(code, message)
//    The [message] will be rewritten
class BaseException extends Error implements Exception {

  readonly code: number
  readonly message: string
  readonly config: ExceptionConfig = {
    500: 'Bad Request!',
    [errCode.CONFIG_ERROR]: 'Config Error',
    [errCode.BUSINESS_ERROR]: 'Business Error!',
    [errCode.REGION_ERROR]: 'Region Error!',
    [errCode.STAFF_ERROR]: 'States Error!',
    [errCode.REGION_ALREADY_HAS_MANAGER]: 'Region Already Has Manager!',
    [errCode.STORE_ALREADY_HAS_MANAGER]: 'Store Already Has Manager!',
    [errCode.STORE_ALREADY_EXISTS]: 'Store already exists...',
    [errCode.REGION_ALREADY_EXISTS]: 'Region Already Exists...',
    [errCode.REGION_NOT_FOUND]: 'Umm... We can\'t spot the region...',
    [errCode.STORE_NOT_FOUND]: 'Umm... We can\'t spot the store...',
    [errCode.STAFF_ERROR]: 'Staff Error!',
    [errCode.REGION_ALREADY_HAS_MANAGER]: 'Region Already Has Manager!',
    [errCode.STORE_ALREADY_HAS_MANAGER]: 'Store Already Has Manager!',
    [errCode.STAFF_ALREADY_EXISTS]: 'Umm... Staff already there...',
    [errCode.PARAMETER_ERROR]: 'Nah Nah...Parameters are not in the right form.',
    [errCode.REGION_ALREADY_HAS_MANAGER]: 'Region Already Has Manager!',
    [errCode.STORE_ALREADY_HAS_MANAGER]: 'Store Already Has Manager!',
    [errCode.STORE_ERROR]: 'Store Error!',
    [errCode.STORE_ALREADY_EXISTS]: 'Ah...Store already exists!',
    [errCode.USER_ERROR]: 'Staff Error!',
    [errCode.USER_EXISTS]: 'Oops! It seems you had a shadow...!',
    [errCode.REGISTRATION_ERROR]: 'Registration Error!',
    [errCode.LOGIN_ERROR]: 'Login Error',
    [errCode.TOKEN_ERROR]: 'Oops! Something seems wrong with your token...',
    [errCode.ACCESS_ERROR]: 'Oops! You are not authorized...',
    [errCode.AUTH_ERROR]: 'Auth Error!',
    [errCode.STAFF_NOT_FOUND]: 'State Not Found.',
    [errCode.DUPLICATE_STORE_NAME]: 'Oops, this name exits already.',
    [errCode.TRANSACTION_ERROR]: 'Database Transaction Error',
  }

  constructor (code: number = 500, message?: string|null|undefined) {
    super()
    this.code = code
    if (message) this.message = message
    else this.message = this.config[this.code] || 'Bad Request'
  }

}

export default BaseException