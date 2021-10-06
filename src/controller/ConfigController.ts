import { errCode } from "../config/errCode"
import { ParameterException } from "../exception"
import ConfigException from "../exception/ConfigException"
import BaseController from "./BaseController"
const ConfigService = require('../service/ConfigService')
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

}

export default new Config()