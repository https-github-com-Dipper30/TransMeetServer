import { errCode } from "../config/errCode"
import { ParameterException } from "../exception"
import { ConfigException } from "../exception"
import BaseController from "./BaseController"
import { ConfigService } from "../service"
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
        if (!BaseValidator.isPositiveInteger(region_id)) throw new ParameterException('Invalid ID')
        getStatesFn = ConfigService.getStatesInRegion
      }

      const states = await getStatesFn(region_id)
      if (!states) throw new ConfigException('States error', errCode.STATES_FAILURE)
    
      res.json({
        code: 200,
        data: states
      })
    } catch (error) {
      next(error)
    }
  }

  async getBusinessTypes (req: any, res: any, next: any): Promise<any> {
    try {
      const bts = await ConfigService.getBusinessTypes()
      if (!bts) throw new ConfigException('Business error', errCode.BUSINESS_FAILURE)
    
      res.json({
        code: 200,
        data: bts
      })
    } catch (error) {
      next(error)
    }
  }

  async getRegions (req: any, res: any, next: any): Promise<any> {
    try {
      const regions = await ConfigService.getRegions()
      if (!regions) throw new ConfigException('Region error', errCode.REGION_FAILURE)
    
      res.json({
        code: 200,
        data: regions
      })
    } catch (error) {
      next(error)
    }
  }

  // add new staff
  async addStaff (req: any, res: any, next: any): Promise<any> {
    try {
      // const regions = await ConfigService.getRegions()
      // if (!regions) throw new ConfigException('Region error', errCode.REGION_FAILURE)
    


      res.json({
        code: 200,
        data: 1
      })
    } catch (error) {
      next(error)
    }
  }

  // get all staff
  // dynamic criteria {id || region_assigned || store_assigned || job_title }
  async getStaff (req: any, res: any, next: any): Promise<any> {
    try {
      // const regions = await ConfigService.getRegions()
      // if (!regions) throw new ConfigException('Region error', errCode.REGION_FAILURE)
    


      res.json({
        code: 200,
        data: 1
      })
    } catch (error) {
      next(error)
    }
  }

}

export default new Config()