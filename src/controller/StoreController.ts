import { errCode } from "../config/errCode"
import { ParameterException, StoreException } from "../exception"
import { StoreType } from '../types/Service'
import StoreValidator from "../validator/StoreValidator"
import BaseController from "./BaseController"
const StoreService = require('../service/StoreService')

class Store extends BaseController {

  constructor () {
    super()
  }

  async addStore (req: any, res: any, next: any): Promise<any> {
    try {
      const data: StoreType = req.body

      const valid = new StoreValidator(data)
      if (!valid.goCheck()) throw new ParameterException('Store parameter error')

      const created = await StoreService.addStore(data)
      if (created === false) throw new StoreException('Duplicates Or Unknown Error!')

      res.json({
        code: 201,
        msg: 'Store Created!'
      })
    } catch (error) {
      next(error)
    }
  }

}

export default new Store()