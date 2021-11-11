import { errCode } from '../config/errCode'
import { ExceptionConfig } from '../types/common'
import BaseException from './BaseException'

class CartException extends BaseException {

  config: ExceptionConfig = {
    [errCode.CART_ERROR]: 'Cart Error',
  }

  constructor (code: number = errCode.CART_ERROR, message?: string|null|undefined) {
    super(code, message)
  }
}

export default CartException