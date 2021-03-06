import { errCode } from '../config/errCode'
import { ExceptionConfig } from '../types/common'
import BaseException from './BaseException'

class ParameterException extends BaseException {
  
  config: ExceptionConfig = {
    [errCode.PARAMETER_ERROR]: 'Nah Nah...Parameters are not in the right form.',
    [errCode.REGION_ALREADY_HAS_MANAGER]: 'Region Already Has Manager!',
    [errCode.STORE_ALREADY_HAS_MANAGER]: 'Store Already Has Manager!',
  }

  constructor (code: number = errCode.PARAMETER_ERROR, message?: string|null|undefined) {
    super(code, message)
  }
}

export default ParameterException