import { errCode } from '../config'
import { DatabaseException, ParameterException } from '../exception'
import { ConfigException } from '../exception'
import BaseController from './BaseController'
import { GetStaff, Staff } from '../types/User'
import { ConfigService, StaffService } from '../service'
import StaffValidator from '../validator/StaffValidator'
import { isError } from '../utils/tools'
const B = require('../validator/BaseValidator')
const BaseValidator = new B()

class Config extends BaseController {

  constructor () {
    super()
  }

  async getStates (req: any, res: any, next: any): Promise<any> {
    try {
      let { region_id } = req.query
      let getStatesFn: Function

      if (!region_id && region_id != 0) getStatesFn = ConfigService.getStates
      else {
        region_id = parseInt(region_id)
        if (!BaseValidator.isPositiveInteger(region_id)) throw new ParameterException(errCode.PARAMETER_ERROR, 'Wrong ID')
        getStatesFn = ConfigService.getStatesInRegion
      }

      const states = await getStatesFn(region_id)
      if (!states) throw new ConfigException(errCode.STATES_ERROR)
    
      res.json({
        code: 200,
        data: states,
      })
    } catch (error) {
      next(error)
    }
  }

  async getBusinessTypes (req: any, res: any, next: any): Promise<any> {
    try {
      const bts = await ConfigService.getBusinessTypes()
      if (!bts) throw new ConfigException(errCode.BUSINESS_ERROR)
    
      res.json({
        code: 200,
        data: bts,
      })
    } catch (error) {
      next(error)
    }
  }

  async getRegions (req: any, res: any, next: any): Promise<any> {
    try {
      const regions = await ConfigService.getRegions()
      if (!regions) throw new ConfigException(errCode.REGION_ERROR)
    
      res.json({
        code: 200,
        data: regions,
      })
    } catch (error) {
      next(error)
    }
  }

  async getCategories (req: any, res: any, next: any): Promise<any> {
    try {
      const categories = await ConfigService.getCategories()
      if (isError(categories)) throw categories
    
      res.json({
        code: 200,
        data: categories,
      })
    } catch (error) {
      next(error)
    }
  }

  async getTypes (req: any, res: any, next: any): Promise<any> {
    try {
      const { query } = req
      const code = Number(query.cate_code)
      if (code && typeof code != 'number') throw new ParameterException()
      const types = await ConfigService.getTypes(code)
      if (isError(types)) throw types
    
      res.json({
        code: 200,
        data: types,
      })
    } catch (error) {
      next(error)
    }
  }

}

export default new Config()