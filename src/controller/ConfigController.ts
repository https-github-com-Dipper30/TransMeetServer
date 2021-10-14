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

  // add new staff
  async addStaff (req: any, res: any, next: any): Promise<any> {
    try {
      // const regions = await ConfigService.getRegions()
      // if (!regions) throw new ConfigException('Region error', errCode.REGION_ERROR)
      const data: Staff = req.body

      const valid = new StaffValidator(data)
      if (!valid.goCheck()) throw new ParameterException()

      const created: any = await StaffService.addStaff(data)
      if (isError(created)) throw created

      if (!created) throw new DatabaseException()

      res.json({
        code: 201,
        data: 'Staff Created!',
      })
    } catch (error) {
      next(error)
    }
  }

  // get all staff
  // dynamic criteria { id || region_assigned || store_assigned || job_title }
  async getStaff (req: any, res: any, next: any): Promise<any> {
    try {
      const query: GetStaff = req.query
      const valid = new StaffValidator(query)
      const data = valid.checkGet()
      if (!data) throw new ParameterException()

      const staff = await StaffService.getStaff(data)
      if (isError(staff)) throw staff

      res.json({
        code: 200,
        data: staff,
      })
    } catch (error) {
      next(error)
    }
  }

}

export default new Config()