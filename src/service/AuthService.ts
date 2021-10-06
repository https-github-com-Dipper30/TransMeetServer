import { role } from '../config/auth'
import { Account } from '../types/common'
import { User, HomeCustomer, Admin, BusinessCustomer } from '../types/User'
import BaseService from './BaseService'
import { encryptMD5, omitFields } from '../utils/tools'

const models = require('../../db/models/index.js')
const { sequelize } = require('../../db/models')
const {
  User: UserModel,
  Home_Customer: Home_Customer,
  Business_Customer: Business_Customer,
  Admin: AdminModel,
  Access: AccessModel,
} = models

// const Op = Sequelize.Op

class Auth extends BaseService {
  constructor () {
    super()
  } 

  async findAccount (username: string) {
    try {
      //TODO ignore case
      const hasAccount = await UserModel.findOne({
        where: {
          username
        }
      })
      return !!hasAccount
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
        role_id: params.role_id
      }, {transaction: t})

      const { id } = user // user id
      const { role_id } = params
      let res: any = user
      if (role_id == role.ADMIN) {
        //
        res = await AdminModel.create({
          name: params.name,
          uid: id,
        }, {transaction: t})
        console.log('admin added')
      } else if (role_id == role.BUSINESS_CUSTOMER) {
        //
        res = await Business_Customer.create({
          cate: params.cate,
          annual_income: params.annual_income,
          street: params.street,
          city: params.city,
          state_id: params.state_id,
          zip_code: params.zip_code,
          uid: id,
        }, {transaction: t})
      } else if (role_id == role.HOME_CUSTOMER) {
        //
        res = await Home_Customer.create({
          marriage_status: params.marriage_status,
          gender: params.password,
          birth: params.birth,
          annual_income: params.annual_income,
          street: params.street,
          city: params.city,
          state_id: params.state_id,
          zip_code: params.zip_code,
          uid: id,
        }, {transaction: t})
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
          password: p
        }
      })
      if ( !user ) return false
      /**
       * get access
       * select name from access_roles join accesses on aid = accesses.type where rid = user.role_id;
       */
      const [accesses, metadata] = await sequelize.query(`select name from access_roles join accesses on aid = accesses.type where rid = ${user.role_id};`)
      const auth = Array.from(accesses).map((ac: any) => ac.name)
      const res = omitFields(user.dataValues, ['password'])

      return {
        ...res,
        auth
      }
    } catch (error) {
      return false
    }
  }

}

module.exports = new Auth()