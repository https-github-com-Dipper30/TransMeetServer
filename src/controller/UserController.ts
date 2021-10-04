import BaseController from "./BaseController"

class User extends BaseController {
  constructor () {
    super()
  }

  async getUserByID (req: Request, res: any, next: any): Promise<any> {
    try {
      res.json({
        code: 200,
        data: {},
        msg: 'success'
      })
    } catch (error) {
      next(error)
    }
  }


}

export default new User()