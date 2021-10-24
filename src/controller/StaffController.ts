import { errCode } from '../config'
import { DatabaseException, ParameterException, TokenException } from '../exception'
import BaseController from './BaseController'
import { GetStaff, Staff as StaffType } from '../types/User'
import { StaffService, TokenService } from '../service'
import StaffValidator from '../validator/StaffValidator'
import { isError } from '../utils/tools'

class Staff extends BaseController {

  constructor () {
    super()
  }

  // add new staff
  async addStaff (req: any, res: any, next: any): Promise<any> {
    try {
      // const regions = await ConfigService.getRegions()
      // if (!regions) throw new ConfigException('Region error', errCode.REGION_ERROR)
      const data: StaffType = req.body

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
      // const Token = new TokenService(req.headers.token)
      // if (!Token.verifyToken()) throw new TokenException()
      
      const query: GetStaff = req.query
      const valid = new StaffValidator(query)
      const data = valid.checkGet()
      if (!data) throw new ParameterException()

      // console.log('dd',data)
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

export default new Staff()