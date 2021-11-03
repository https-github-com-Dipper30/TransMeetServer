import { errCode } from '../config/errCode'
import { ExceptionConfig } from '../types/common'
import BaseException from './BaseException'

class FileException extends BaseException {

  constructor (code: number = errCode.AUTH_ERROR, message?: string|null|undefined) {
    super(code, message)
  }
}

export default FileException