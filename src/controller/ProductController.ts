import BaseController from './BaseController'
import { User, HomeCustomer, Admin, BusinessCustomer } from '../types/User'
import { Validator, Account } from '../types/common'
import { AuthException, ParameterException, UserException, DatabaseException, TokenException } from '../exception'
import { errCode } from '../config'
import { ProductValidator } from '../validator'
import { AuthService, TokenService } from '../service'
import { GetProduct, ListProduct, ProductType } from '../types/Service'
import ProductService from '../service/ProductService'
import { isError } from '../utils/tools'
import { nextTick } from 'process'

class Product extends BaseController {
  constructor () {
    super()
  }

  async addProduct (req: any, res: any, next: any): Promise<any> {
    try {
      const Token = new TokenService(req.headers.token)
      if (!Token.verifyToken()) throw new TokenException()

      const data: ProductType = req.body
      const valid: ProductValidator = new ProductValidator(data)
      if (!valid.goCheck()) throw new ParameterException()

      const created: any = await ProductService.addProduct(data)
      if (isError(created)) throw created

      res.json({
        code: 201,
        data: {
          id: created.id,
        },
      })
    } catch (error) {
      next(error)
    }
  }

  async listProduct (req: any, res: any, next: any): Promise<any> {
    try {
      const data: ListProduct = req.body
      const valid: ProductValidator = new ProductValidator(data)
      if (!valid.checkList()) throw new ParameterException()

      const listed: any = await ProductService.listProduct(data)
      if (isError(listed)) throw listed

      res.json({
        code: 200,
        msg: 'listed!',
      })
    } catch (error) {
      next(error)
    }
  }

  async unlistProduct (req: any, res: any, next: any): Promise<any> {
    try {
      const data: ListProduct = req.body
      const valid: ProductValidator = new ProductValidator(data)
      if (!valid.checkUnlist()) throw new ParameterException()

      const unlisted: any = await ProductService.unlistProduct(data)
      if (isError(unlisted)) throw unlisted

      res.json({
        code: 200,
        msg: 'unlisted!',
      })
    } catch (error) {
      next(error)
    }
  }

  async deleteProduct (req: any, res: any, next: any): Promise<any> {
    try {
      const data: ListProduct = req.body
      const valid: ProductValidator = new ProductValidator(data)
      if (!valid.checkDelete()) throw new ParameterException()

      const deleted: any = await ProductService.deleteProduct(data)
      if (isError(deleted)) throw deleted

      res.json({
        code: 200,
        msg: 'deleted!',
      })
    } catch (error) {
      next(error)
    }
  }

  async getProduct (req: any, res: any, next: any): Promise<any> {
    try {
      const query: GetProduct = req.query
      const valid = new ProductValidator(query)
      const data = valid.checkGet()
      if (!data) throw new ParameterException()

      const product = await ProductService.getProduct(data)
      if (isError(product)) throw product

      res.json({
        code: 200,
        data: product,
      })
    } catch (error) {
      next(error)
    }
  }

}

export default new Product()