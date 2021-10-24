import { errCode } from '../config/errCode'
import { ExceptionConfig } from '../types/common'
import BaseException from './BaseException'

class ProductException extends BaseException {

  config: ExceptionConfig = {
    [errCode.PRODUCT_ERROR]: 'Product Error!',
    [errCode.PRODUCT_NOT_FOUND]: 'Product Not Found!',
    [errCode.PRODUCT_SOLD_OUT]: 'Product Sold Out!',
    [errCode.PRODUCT_EXISTS]: 'Ah...Product already exists!',
  }

  constructor (code: number = errCode.STORE_ERROR, message?: string|null|undefined) {
    super(code, message)
  }
}

export default ProductException