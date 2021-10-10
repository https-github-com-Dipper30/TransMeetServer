import { errCode } from '../config/errCode'
import { ExceptionConfig } from '../types/common'
import BaseException from './BaseException'

class StaffException extends BaseException {

  config: ExceptionConfig = {
    [errCode.STAFF_ERROR]: 'Staff Error!',
    [errCode.REGION_ALREADY_HAS_MANAGER]: 'Region Already Has Manager!',
    [errCode.STORE_ALREADY_HAS_MANAGER]: 'Store Already Has Manager!',
    [errCode.STAFF_ALREADY_EXISTS]: 'Umm... Staff already there...'
  }

  constructor (code: number = errCode.STAFF_ERROR, message?: string|null|undefined) {
    super(code, message)
  }
}

export default StaffException