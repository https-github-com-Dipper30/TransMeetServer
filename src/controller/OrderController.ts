import BaseController from './BaseController'
import { AuthException, ParameterException, UserException, DatabaseException, TokenException, FileException, ConfigException } from '../exception'
import { access, errCode } from '../config'
import { ProductValidator } from '../validator'
import { AuthService, FileService, OrderService, TokenService } from '../service'
import { GetProduct, ListProduct, ProductType, Order as OrderType, PlaceOrder, GetOrder } from '../types/Service'
import ProductService from '../service/ProductService'
import { isError } from '../utils/tools'
import OrderValidator from '../validator/OrderValidator'

class Order extends BaseController {
  constructor () {
    super()
  }

  /**
   * handle an array of orders
   * @params { uid: number, time: number, totalPrice: number, orders: OrderType[] }
   * return result of each order
   */
  async placeOrder (req: any, res: any, next: any): Promise<any> {
    try {
      // const Token = new TokenService(req.headers.token)
      // if (!Token.verifyToken()) throw new TokenException()

      /**
       * for further access control, do the following codes
       * const res = Token.verifyToken()
       * const { userID, auth } = res
       * if (!auth.includes(someAccess)) return false
       */

      const Token = new TokenService(req.headers.token)
      const token = Token.verifyToken()
      if (!token) throw new TokenException()
      const { userID, auth } = token
      if (req.body?.uid != userID || !auth.includes(access.BUY_PRODUCTS)) throw new ConfigException(errCode.ACCESS_ERROR)
      console.log(token)
      const data: PlaceOrder = req.body
      const valid: OrderValidator = new OrderValidator(data)
      if (!valid.goCheck()) throw new ParameterException()

      const result: any = await OrderService.handleOrders(data)
      if (isError(result)) throw result

      res.json({
        code: 200,
        data: result,
      })
    } catch (error) {
      next(error)
    }
  }

  async getOrders (req: any, res: any, next: any): Promise<any> {
    try {
      const Token = new TokenService(req.headers.token)
      const token = Token.verifyToken()
      if (!token) throw new TokenException()
      const { userID, auth } = token
      if (req.body?.uid != userID || auth.includes(access.BROWSE_TRANSACTIONS_ADMIN)) throw new ConfigException(errCode.ACCESS_ERROR)

      const data: GetOrder = req.body
      const valid: OrderValidator = new OrderValidator(data)
      const query = valid.checkGet()
      if (!query) throw new ParameterException()

      const result: any = await OrderService.getOrders(query)
      if (isError(result)) throw result

      res.json({
        code: 200,
        data: result,
      })
    } catch (error) {
      next(error)
    }
  }

}

export default new Order()