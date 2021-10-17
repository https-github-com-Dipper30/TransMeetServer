import { errCode } from '../config/errCode'
import { ExceptionConfig } from '../types/common'
import BaseException from './BaseException'

class StoreException extends BaseException {

  config: ExceptionConfig = {
    [errCode.STORE_ERROR]: 'Store Error!',
    [errCode.STORE_ALREADY_EXISTS]: 'Ah...Store already exists!',
    [errCode.DUPLICATE_STORE_NAME]: 'Oops, this name exits already.',
  }

  constructor (code: number = errCode.STORE_ERROR, message?: string|null|undefined) {
    super(code, message)
  }
}

export default StoreException