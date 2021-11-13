import BaseController from './BaseController'
import { AuthException, ParameterException, UserException, DatabaseException, TokenException, FileException } from '../exception'
import { errCode } from '../config'
import { CartValidator, ProductValidator } from '../validator'
import { AuthService, CartService, FileService, TokenService } from '../service'
import { AddToCart, GetCart, GetProduct, IsInCart, ListProduct, ProductType } from '../types/Service'
import ProductService from '../service/ProductService'
import { isError } from '../utils/tools'
import { nextTick } from 'process'

class Cart extends BaseController {
  constructor () {
    super()
  }

  async addToCart (req: any, res: any, next: any): Promise<any> {
    try {
      // const Token = new TokenService(req.headers.token)
      // if (!Token.verifyToken()) throw new TokenException()

      /**
       * for further access control, do the following codes
       * const res = Token.verifyToken()
       * const { auth } = res
       * if (!auth.includes(someAccess)) return false
       */

      const data: AddToCart = req.body
      const valid: CartValidator = new CartValidator(data)
      if (!valid.goCheck()) throw new ParameterException()

      const added: any = await CartService.addToCart(data)
      if (isError(added)) throw added

      res.json({
        code: 201,
        msg: 'added',
      })
    } catch (error) {
      next(error)
    }
  }

  async getCatItems (req: any, res: any, next: any): Promise<any> {
    try {
      // const Token = new TokenService(req.headers.token)
      // if (!Token.verifyToken()) throw new TokenException()

      let data: any = req.query
      const valid: CartValidator = new CartValidator(data)
      data = valid.checkGet()
      if (!data) throw new ParameterException()

      const cart: any = await CartService.getCartItems(data)
      if (isError(cart)) throw cart

      res.json({
        code: 200,
        data: cart,
      })
    } catch (error) {
      next(error)
    }
  }

  // check if the product is in user's cart
  async isInCart (req: any, res: any, next: any): Promise<any> {
    try {
      // const Token = new TokenService(req.headers.token)
      // if (!Token.verifyToken()) throw new TokenException()

      let data: IsInCart = req.body
      const valid: CartValidator = new CartValidator(data)
      if (!valid.checkIsInCart()) throw new ParameterException()

      const isInCart: any = await CartService.isInCart(data)
      if (isError(isInCart)) throw isInCart

      res.json({
        code: 200,
        data: isInCart,
      })
    } catch (error) {
      next(error)
    }
  }

}

export default new Cart()