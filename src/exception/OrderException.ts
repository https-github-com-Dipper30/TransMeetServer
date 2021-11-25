import { errCode } from '../config/errCode'
import { ExceptionConfig } from '../types/common'
import BaseException from './BaseException'

class OrderException extends BaseException {

  config: ExceptionConfig = {
    [errCode.ORDER_ERROR]: 'Order Error',
  }

  constructor (code: number = errCode.ORDER_ERROR, message?: string|null|undefined) {
    super(code, message)
  }
}

export default OrderException