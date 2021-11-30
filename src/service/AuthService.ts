import { role } from '../config/auth'
import { Account } from '../types/common'
import { User, HomeCustomer, Admin, BusinessCustomer, UpdateUser } from '../types/User'
import BaseService from './BaseService'
import { encryptMD5, omitFields } from '../utils/tools'
import { UserException } from '../exception'
import { errCode } from '../config'

const models = require('../../db/models/index.js')
const { sequelize } = require('../../db/models')
const {
  User: UserModel,
  Home_Customer,
  Business_Customer,
  Admin: AdminModel,
  Access: AccessModel,
} = models

// const Op = Sequelize.Op

class Auth extends BaseService {
  constructor () {
    super()
  } 

  async findAccountByUsername (username: string): Promise<Boolean> {
    try {
      //TODO ignore case
      const hasAccount = await UserModel.findOne({
        where: {
          username,
        },
      })
      return Boolean(hasAccount)
    } catch (error) {
      return false
    }
  }

  async findAccountByUserID (id: number): Promise<any> {
    try {
      const user = await UserModel.findByPk(id)
      if (!user) return false

      // get details from Home_Customer || Business_Customer || Admin_Customer
      let detail: any
      if (user.role_id == role.ADMIN) {
        detail = await AdminModel.findOne({
          where: {
            uid: user.id,
          },
        })
      } else if (user.role_id == role.HOME_CUSTOMER) {
        detail = await Home_Customer.findOne({
          where: {
            uid: user.id,
          },
        })
      } else if (user.role_id == role.BUSINESS_CUSTOMER) {
        detail = await Business_Customer.findOne({
          where: {
            uid: user.id,
          },
        })
      }
      if (!detail) return false
      /**
       * get access
       * select name from access_roles join accesses on aid = accesses.type where rid = user.role_id;
       */
      const [accesses, metadata] = await sequelize.query(`select type from Access_Roles join Accesses on aid = Accesses.type where rid = ${user.role_id};`)
      const auth = Array.from(accesses).map((ac: any) => ac.type)
      const res = omitFields({ ...user.dataValues, ...detail.dataValues }, ['password'])

      return {
        ...res,
        auth,
      }
    } catch (error) {
      return false
    }
  }

  async addAccount (params: User|Admin|HomeCustomer|BusinessCustomer) {
    const t = await sequelize.transaction()
    
    try {
      // transaction
      // create user
      const user = await UserModel.create({
        username: params.username,
        password: encryptMD5(params.password),
        role_id: params.role_id,
      }, { transaction: t })

      const { id } = user // user id
      const { role_id } = params
      let res: any = user
      if (role_id == role.ADMIN) {
        //
        res = await AdminModel.create({
          name: params.name,
          uid: id,
        }, { transaction: t })
      } else if (role_id == role.BUSINESS_CUSTOMER) {
        //
        res = await Business_Customer.create({
          name: params.name,
          cate: params.cate,
          phone: params.phone,
          email: params.email,
          annual_income: params.annual_income,
          street: params.street,
          city: params.city,
          state_id: params.state_id,
          zip_code: params.zip_code,
          uid: id,
        }, { transaction: t })
      } else if (role_id == role.HOME_CUSTOMER) {
        res = await Home_Customer.create({
          marriage_status: params.marriage_status,
          gender: params.gender,
          birth: params.birth,
          phone: params.phone,
          email: params.email,
          annual_income: params.annual_income,
          street: params.street,
          city: params.city,
          state_id: params.state_id,
          zip_code: params.zip_code,
          uid: id,
        }, { transaction: t })
      }
      await t.commit()
      return res
    } catch (error) {
      // something wrong
      await t.rollback()
      return false
    }
  }

  async loginAccount (params: Account) {
    const { username, password } = params
    const p = encryptMD5(password)
    try {
      const user = await UserModel.findOne({
        where: {
          username,
          password: p,
        },
      })

      if ( !user ) return false
      // get details from Home_Customer || Business_Customer || Admin_Customer
      let detail: any
      if (user.role_id == role.ADMIN) {
        detail = await AdminModel.findOne({
          where: {
            uid: user.id,
          },
        })
      } else if (user.role_id == role.HOME_CUSTOMER) {
        detail = await Home_Customer.findOne({
          where: {
            uid: user.id,
          },
        })
      } else if (user.role_id == role.BUSINESS_CUSTOMER) {
        detail = await Business_Customer.findOne({
          where: {
            uid: user.id,
          },
        })
      }
      if (!detail) return false
      
      /**
       * get access
       * select name from access_roles join accesses on aid = accesses.type where rid = user.role_id;
       */
      const [accesses, metadata] = await sequelize.query(`select type from Access_Roles join Accesses on aid = Accesses.type where rid = ${user.role_id};`)
      const auth = Array.from(accesses).map((ac: any) => ac.type)
      const res = omitFields({ ...user.dataValues, ...detail.dataValues }, ['id', 'password'])

      return {
        ...res,
        auth,
      }
    } catch (error) {
      return false
    }
  }

  async getUserInfo (query: { uid: number }) {
    try {
      const { uid } = query
      const user = await UserModel.findByPk(uid, {
        attributes: [
          'id',
          'role_id',
          'username',
        ],
      })
      let detail: any
      if (user.role_id == role.ADMIN) {
        detail = await AdminModel.findOne({
          where: {
            uid: user.id,
          },
        })
      } else if (user.role_id == role.HOME_CUSTOMER) {
        detail = await Home_Customer.findOne({
          where: {
            uid: user.id,
          },
        })
      } else if (user.role_id == role.BUSINESS_CUSTOMER) {
        detail = await Business_Customer.findOne({
          where: {
            uid: user.id,
          },
        })
      }
      const [accesses, metadata] = await sequelize.query(`select type from Access_Roles join Accesses on aid = Accesses.type where rid = ${user.role_id};`)
      const auth = Array.from(accesses).map((ac: any) => ac.type)
      const result = omitFields({ ...user.dataValues, ...detail.dataValues }, ['id', 'password'])
      return {
        ...result,
        auth,
      }
    } catch (error) {
      return error
    }
  }

  async update (data: UpdateUser) {
    const t = await sequelize.transaction()
    try {
      const user = await UserModel.findByPk(data.uid, { transaction: t })
      if (!user) throw new UserException()

      if (data.username && user.username != data.username) {
        const hasAccount = await this.findAccountByUsername(user.username)
        if (hasAccount) throw new UserException(errCode.USER_EXISTS)
        user.username = data.username
      }
      const obj: any = data
      delete obj.uid
      delete obj.username
      let detail: any
      if (user.role_id == role.HOME_CUSTOMER) {
        detail = await Home_Customer.findOne({
          where: { uid: user.id },
          transaction: t,
        })
        for (let attr in obj) {
          detail[attr] = obj[attr]
        }
        await detail.save()
      } else if (user.role_id == role.BUSINESS_CUSTOMER) {
        detail = await Business_Customer.findOne({
          where: { uid: user.id },
          transaction: t,
        })
        for (let attr in obj) {
          detail[attr] = obj[attr]
        }
        await detail.save()
      } else {

      }
      await user.save()
      return user
    } catch (error) {
      return error
    }
  }

}

export default new Auth()