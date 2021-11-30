import BaseController from './BaseController'
import { User, HomeCustomer, Admin, BusinessCustomer, UpdateUser } from '../types/User'
import { Validator, Account } from '../types/common'
import { AuthException, ParameterException, UserException, DatabaseException, TokenException } from '../exception'
import { errCode } from '../config'
import { AuthValidator } from '../validator'
import { AuthService, TokenService } from '../service'
import { isError } from '../utils/tools'

class Auth extends BaseController {
  constructor () {
    super()
  }

  async checkAccount (req: any, res: any, next: any): Promise<any> {
    try {
      const data = req.body
      const valid: AuthValidator = new AuthValidator(data)
      if (!valid.checkUsername()) throw new ParameterException()

      const userExists: Boolean = await AuthService.findAccountByUsername(data.username)
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

      const userExists: Boolean = await AuthService.findAccountByUsername(data.username)
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
      if (!user) throw new AuthException(errCode.LOGIN_ERROR, 'Wrong Username or Password I Guess...')

      // logged in, return a token
      const t = new TokenService({ userID: user.uid, auth: user.auth })
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

  async getInfoByToken (req: any, res: any, next: any): Promise<any> {
    try {
      const token = new TokenService(req.headers.token)
      const decode = token.verifyToken()
      if (!decode) throw new TokenException()

      const user = await AuthService.findAccountByUserID(decode.userID)
      if (!user) throw new TokenException()
      res.json({
        code: 200,
        data: {
          user,
        },
      })

    } catch (error) {
      next(error)
    }
  }

  async getUserInfo (req: any, res: any, next: any): Promise<any> {
    try {
      const valid: AuthValidator = new AuthValidator(req.query)
      const query: any = valid.checkInfo()
      if (!query) throw new ParameterException()

      const token = new TokenService(req.headers.token)
      const { userID } = token.verifyToken()
      if (!userID) throw new TokenException()
      if (userID != query.uid) throw new AuthException(errCode.ACCESS_ERROR)

      const info = await AuthService.getUserInfo(query)
      if (isError(info)) throw info

      res.json({
        code: 200,
        data: info,
      })

    } catch (error) {
      next(error)
    }
  }

  async update (req: any, res: any, next: any): Promise<any> {
    try {
      const data: UpdateUser = req.body
      const valid: AuthValidator = new AuthValidator(data)
      if (!valid.checkUpdate()) throw new ParameterException()

      const token = new TokenService(req.headers.token)
      const { userID } = token.verifyToken()
      if (!userID) throw new TokenException()
      if (userID != data.uid) throw new AuthException(errCode.ACCESS_ERROR)

      const updated = await AuthService.update(data)
      if (isError(updated)) throw updated

      res.json({
        code: 200,
        msg: 'updated',
      })

    } catch (error) {
      next(error)
    }
  }

}

export default new Auth()