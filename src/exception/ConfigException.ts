import { errCode } from '../config/errCode'
import { ExceptionConfig } from '../types/common'
import BaseException from './BaseException'

class ConfigException extends BaseException {

  constructor (code: number = errCode.CONFIG_ERROR, message?: string|null|undefined) {
    super(code, message)
  }
}

export default ConfigException