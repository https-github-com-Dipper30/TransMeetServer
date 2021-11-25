import BaseService from './BaseService'
import { Staff as StaffType, GetStaff } from '../types/User'
import { jobTitle } from '../config/common'
import { ConfigException, DatabaseException, StoreException } from '../exception'
import { errCode } from '../config/errCode'
import StaffException from '../exception/StaffException'
import { createCriteria, getPagerFromQuery } from '../utils/tools'
import { Op } from 'sequelize'
const { sequelize } = require('../../db/models')
const models = require('../../db/models')
const { 
  Staff: StaffModel,
  Region: RegionModel,
  Store: StoreModel,
} = models

class Staff extends BaseService {

  constructor () {
    super()
  }

  async addStaff (staff: StaffType) {
    const t = await sequelize.transaction() 
    try {
      // if two staff are both salesperson in the same store, their names can't the same
      // there is only one store manager or region manager and the staff can only be assigned by one job title

      // firstly, check if the region exists
      const region = await RegionModel.findOne({
        where: {
          id: staff.region_assigned,
        },
      })

      if (!region) throw new ConfigException(errCode.REGION_NOT_FOUND, 'The staff has no region to go to...')

      // 2. if the staff is not a region manager, we need to make sure the store exists
      if (staff.job_title != jobTitle.REGION_MANAGER) {
        const store = await StoreModel.findOne({
          where: {
            id: staff.store_assigned,
          },
        })
        if (!store) throw new StoreException(errCode.STORE_NOT_FOUND, 'The staff has no store to go to...')

        // 3. if the staff is a store manager, then make sure the store does not have a manager already
        if (staff.job_title == jobTitle.STORE_MANAGER) {
          if (store.manager_id) throw new ConfigException(errCode.STORE_ALREADY_HAS_MANAGER)
          // insert store manager
          return await this.insertStoreManager(staff, store, t)
        }

        // 4. if the staff is a salesperson, then make sure there are no duplicate names in the same store
        if (staff.job_title == jobTitle.SALESPERSON) {
          // insert salesperson
          return await this.insertSalesPerson(staff, t)
        }
      } else {
        // 5. if the staff is a region manager, we need to make sure the region does not have a manager already
        if (region.manager_id) throw new ConfigException(errCode.REGION_ALREADY_HAS_MANAGER)
        // insert region manager
        return await this.insertRegionManager(staff, region, t)
      }
      await t.commit()
      return true
    } catch (error) {
      await t.rollback()
      return error
    }
  }

  async insertRegionManager (staff: StaffType, region: any, t: any) {
    try {
      const s = await StaffModel.create(staff, { transaction: t })
      region.manager_id = s.id
      await region.save()
      await t.commit()
      return true
    } catch (error) {
      // something wrong
      await t.rollback()
      return new DatabaseException(errCode.TRANSACTION_ERROR)
    }
  }

  async insertStoreManager (staff: StaffType, store: any, t: any) {
    try {
      const s = await StaffModel.create(staff, { transaction: t })
      store.manager_id = s.id
      await store.save()
      return await t.commit()
    } catch (error) {
      // something wrong
      await t.rollback()
      return new DatabaseException(errCode.TRANSACTION_ERROR)
    }
  }

  async insertSalesPerson (staff: StaffType, t: any) {
    try {
      const [res, created] = await StaffModel.findOrCreate({
        where: {
          name: staff.name,
          store_assigned: staff.store_assigned,
        },
        defaults: staff,
        transaction: t,
      })
      if (!created) throw new StaffException(errCode.STAFF_ALREADY_EXISTS)
      await t.commit()
      return true
    } catch (error) {
      // something wrong
      await t.rollback()
      return error
    }
  }

  /**
   * dynamic query criteria
   * 1-id 2-region_assigned 3-store_assigned
   * 3-job_title 4-salary staff who have a salary beneath certain amount
   * @param {GetStaff} query
   * @returns an exception or an array of results
   */
  async getStaff (query: GetStaff) {
    const criteria: any = createCriteria(query, ['id', 'region_assigned', 'store_assigned', 'job_title', 'salary'])
    if (criteria.hasOwnProperty('salary')) {
      Object.defineProperty(criteria, 'salary', {
        value: {
          [Op.lt]: query.salary,
        },
      })
    }
    if (criteria.hasOwnProperty('page')) {
      delete criteria['page']
    }
    if (criteria.hasOwnProperty('size')) {
      delete criteria['size']
    }
    const [limit, offset] = getPagerFromQuery(query)
    try {
      // TODO alias will cause error, why???
      StaffModel.belongsTo(StoreModel, { foreignKey: 'store_assigned', targetKey: 'id' })
      StaffModel.belongsTo(RegionModel, { foreignKey: 'region_assigned', targetKey: 'id' })

      const staff = await StaffModel.findAndCountAll({
        where: criteria,
        order: [
          ['job_title', 'DESC'],
          ['salary', 'DESC'],
          ['region_assigned'],
          ['store_assigned'],
        ],
        limit,
        offset,
        include: [
          {
            model: StoreModel,
            // as: 'store',
            attributes: ['name'],
          },
          {
            model: RegionModel,
            // as: 'region',
            attributes: ['name'],
          },
        ],
      })
      if (!staff) return new StaffException(errCode.STAFF_ERROR)

      return staff
    } catch (error) {
      return new DatabaseException()
    }
  }

  async getRandomStaffByStoreId (sid: number): Promise<any> {
    try {
      const staff = await StaffModel.findAndCountAll({
        where: {
          store_assigned: sid,
        },
      })
      if (!staff) return new StoreException(errCode.STORE_ERROR, 'No staff in store.')
      if (staff.count == 0) return null
      const n: number = Math.floor(Math.random() * parseInt(staff.count))
      
      return staff.rows[n]
    } catch (error) {
      return error
    }
  }

}

export default new Staff()