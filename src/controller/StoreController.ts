import { errCode } from '../config/errCode'
import { ParameterException, StoreException } from '../exception'
import { GetStore, SetStoreManager, StoreType } from '../types/Service'
import { StoreValidator } from '../validator'
import BaseController from './BaseController'
import { StoreService } from '../service'
import { isError } from '../utils/tools'
class Store extends BaseController {

  constructor () {
    super()
  }

  async addStore (req: any, res: any, next: any): Promise<any> {
    try {
      const data: StoreType = req.body

      const valid = new StoreValidator(data)
      if (!valid.goCheck()) throw new ParameterException()

      const created = await StoreService.addStore(data)
      if (created === false) throw new StoreException()
      if (isError(created)) throw created

      res.json({
        code: 201,
        msg: 'Store Created!',
      })
    } catch (error) {
      next(error)
    }
  }

  async getStore (req: any, res: any, next: any) {
    try {
      const query: any = req.query
      const valid = new StoreValidator(query)
      const data = valid.checkGet()
      if (!data) throw new ParameterException()

      const stores: any = await StoreService.getStore(data)
      if (isError(stores)) throw stores

      res.json({
        code: 200,
        data: stores,
      })
    } catch (error) {
      next(error)
    }
  }

  async setManager (req: any, res: any, next: any) {
    try {
      const data: SetStoreManager = req.body
      const valid = new StoreValidator(data)
      if (!valid.checkSetManager()) throw new ParameterException()

      const stores: any = await StoreService.setManager(data)
      if (isError(stores)) throw stores

      res.json({
        code: 201,
        msg: 'success',
      })
    } catch (error) {
      next(error)
    }
  }

  async deleteStore (req: any, res: any, next: any) {
    try {
      const query: any = req.query
      const valid = new StoreValidator(query)
      const data = valid.checkID()
      if (!data) throw new ParameterException()

      const stores: any = await StoreService.deleteStore(data)
      if (isError(stores)) throw stores

      res.json({
        code: 200,
        msg: 'deleted',
      })
    } catch (error) {
      next(error)
    }
  }

}

export default new Store()