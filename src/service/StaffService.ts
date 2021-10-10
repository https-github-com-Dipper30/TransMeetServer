import BaseService from "./BaseService"
import { Staff as StaffType } from '../types/User'
import { jobTitle } from "../config/common"
import { ConfigException, DatabaseException, StoreException } from "../exception"
import { errCode } from "../config/errCode"
import StaffException from "../exception/StaffException"
import { Transaction } from "sequelize/types"
const { sequelize } = require('../../db/models')
const models = require('../../db/models')
const { 
  Staff: StaffModel,
  Region: RegionModel,
  Store: StoreModel
} = models

class Staff extends BaseService {

  constructor () {
    super()
  }

  async addStaff (staff: StaffType) {
    try {
      // if two staff are both salesperson in the same store, their names can't the same
      // there is only one store manager or region manager and the staff can only be assigned by one job title

      // firstly, check if the region exists
      const region = await RegionModel.findOne({
        where: {
          id: staff.region_assigned
        }
      })

      if (!region) throw new ConfigException(errCode.REGION_NOT_FOUND, 'The staff has no region to go to...')

      // 2. if the staff is not a region manager, we need to make sure the store exists
      if (staff.job_title != jobTitle.REGION_MANAGER) {
        const store = await StoreModel.findOne({
          where: {
            id: staff.store_assigned
          }
        })
        if (!store) throw new StoreException(errCode.STORE_NOT_FOUND, 'The staff has no store to go to...')

        // 3. if the staff is a store manager, then make sure the store does not have a manager already
        if (staff.job_title == jobTitle.STORE_MANAGER) {
          if (store.manager_id) throw new ConfigException(errCode.STORE_ALREADY_HAS_MANAGER)
          // insert store manager
          console.log('insert store')
          return await this.insertStoreManager(staff, store)
        }

        // 4. if the staff is a salesperson, then make sure there are no duplicate names in the same store
        if (staff.job_title == jobTitle.SALESPERSON) {
          // insert salesperson
          console.log('insert sp')
          return await this.insertSalesPerson(staff)
        }
      } else {
        // 5. if the staff is a region manager, we need to make sure the region does not have a manager already
        console.log('dup', new ConfigException(errCode.REGION_ALREADY_HAS_MANAGER))
        if (region.manager_id) throw new ConfigException(errCode.REGION_ALREADY_HAS_MANAGER)
        // insert region manager
        console.log('insert region')
        return await this.insertRegionManager(staff, region)
      }
      return false
    } catch (error) {
      return error
    }
  }

  async insertRegionManager (staff: StaffType, region: any) {

    const t = await sequelize.transaction()
    try {
      const s = await StaffModel.create(staff, {transaction: t})
      region.manager_id = s.id
      await region.save()
      console.log('??')
      await t.commit()
      return true
    } catch (error) {
      // something wrong
      await t.rollback()
      return new DatabaseException(errCode.TRANSACTION_ERROR)
    }
  }

  async insertStoreManager (staff: StaffType, store: any) {

    const t = await sequelize.transaction()
    try {
      const s = await StaffModel.create(staff, {transaction: t})
      store.manager_id = s.id
      await store.save()
      return await t.commit()
    } catch (error) {
      // something wrong
      await t.rollback()
      return new DatabaseException(errCode.TRANSACTION_ERROR)
    }
  }

  async insertSalesPerson (staff: StaffType) {
    const t = await sequelize.transaction()
    try {
      const [res, created] = await StaffModel.findOrCreate({
        where: {
          name: staff.name,
          store_assigned: staff.store_assigned
        },
        defaults: staff
      })
      if (!created) return new StaffException(errCode.STAFF_ALREADY_EXISTS)
    } catch (error) {
      // something wrong
      await t.rollback()
      return new DatabaseException(errCode.TRANSACTION_ERROR)
    }
  }

}

export default new Staff()