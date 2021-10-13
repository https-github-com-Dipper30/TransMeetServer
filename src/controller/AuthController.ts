import BaseController from "./BaseController"
import { User, HomeCustomer, Admin, BusinessCustomer } from '../types/User'
import { Validator, Account } from '../types/common'
import { AuthException, ParameterException, UserException, DatabaseException } from '../exception'
import { errCode } from '../config/errCode'
import { AuthValidator } from '../validator'
import { AuthService, TokenService } from "../service"

class Auth extends BaseController {
  constructor () {
    super()
  }

  async checkAccount (req: any, res: any, next: any): Promise<any> {
    try {
      const data = req.body
      const valid: AuthValidator = new AuthValidator(data)
      if (!valid.checkUsername()) throw new ParameterException()

      const userExists: Boolean = await AuthService.findAccount(data.username)
      if (userExists) throw new UserException(errCode.USER_EXISTS)
    } catch (error) {
      next(error)
    }
  }

  async register (req: any, res: any, next: any): Promise<any> {
    try {
      const data: User|Admin|HomeCustomer|BusinessCustomer = req.body
      const valid: AuthValidator = new AuthValidator(data)
      if (!valid.checkAuthParam()) throw new ParameterException()

      const userExists: Boolean = await AuthService.findAccount(data.username)
      if (userExists) throw new UserException(errCode.USER_EXISTS)

      const user: any = await AuthService.addAccount(data)
      if (!user) throw new DatabaseException()

      res.json({
        code: 201,
        msg: 'User Created!',
      })
    } catch (error) {
      next(error)
    }
  }

  async login (req: any, res: any, next: any): Promise<any> {
    try {
      const data: Account = req.body
      const valid: AuthValidator = new AuthValidator(data)
      if (!valid.checkAccountParam()) throw new ParameterException()

      const user: any = await AuthService.loginAccount(data)
      if (!user) throw new AuthException(errCode.LOGIN_ERROR)

      // logged in, return a token
      const t = new TokenService(user.id)
      const token = t.generateToken()

      res.json({
        code: 200,
        data: {
          user,
          token,
        },
      })
    } catch (error) {
      next(error)
    }
  }

}

export default new Auth()