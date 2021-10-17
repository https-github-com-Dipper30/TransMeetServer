import BaseService from './BaseService'
import { StoreType, GetStore, SetStoreManager } from '../types/Service'
import { createCriteria, isError } from '../utils/tools'
import { ConfigException, DatabaseException, ParameterException, StoreException } from '../exception'
import { errCode } from '../config'
import StaffException from '../exception/StaffException'
import { Staff as StaffType } from '../types/User'
import { jobTitle } from '../config/common'

const models = require('../../db/models')
const {
  Store: StoreModel,
  Staff: StaffModel,
  Region: RegionModel,
  State: StateModel,
} = models
const { sequelize } = require('../../db/models')

class Store extends BaseService {

  constructor () {
    super()
  }

  /**
   * add a store
   * 1. the manager(allowNull) cannot be assigned another job, when assigned, change his/her job_title
   * 2. region_id must exist
   * 3. name be 3~20 long
   * 4. state_id must exist
   * @param store 
   * @returns 
   */

  async addStore (store: StoreType) {
    const t = await sequelize.transaction()
    try {
      // firstly, check if the region exists
      const region = await RegionModel.findOne({
        where: {
          id: store.region_id,
        },
      })

      if (!region) return new ConfigException(errCode.REGION_NOT_FOUND, 'The staff has no region to go to...')
      
      // secondly, check if the state is in the region
      const state = await StateModel.findOne({
        where: {
          id: store.state_id,
        },
      })
      if (!state) throw new ConfigException(errCode.STATE_NOT_FOUND)
      if (state.region_id != store.region_id) {
        return new ConfigException(errCode.STATES_ERROR, 'State not in region.')
      }

      // thirdly, create store
      const [resStore, created] = await StoreModel.findOrCreate({
        where: {
          region_id: store.region_id,
          name: store.name,
        },
        defaults: store,
        transaction: t,
      })
      if (!created) throw new StoreException(errCode.DUPLICATE_STORE_NAME)

      // check if the staff has a job already
      const { manager_id } = store
      if (manager_id) {
        const staff = await StaffModel.findOne({
          where: {
            id: manager_id,
          },
          transaction: t,
        })
        if (!staff) throw new StaffException(errCode.STAFF_NOT_FOUND)
        
        // if the staff has a job already, over write it and change the original store
        if (this.staffIsStoreManager(staff.dataValues)) {
          const { store_assigned: storeID } = staff
          const anotherStore = await StoreModel.findOne({
            where: {
              id: storeID,
            },
            transaction: t,
          })
          if (!anotherStore) throw new ConfigException(errCode.STORE_NOT_FOUND, 'The staff was assigned a job but the store is not found!')
          anotherStore.manager_id = null
          await anotherStore.save()
        }

        if (this.staffIsRegionManager(staff.dataValues)) {
          const { region_assigned: regionID } = staff
          const anotherRegion = await RegionModel.findOne({
            where: {
              id: regionID,
            },
            transaction: t,
          })
          if (!anotherRegion) throw new ConfigException(errCode.STORE_NOT_FOUND, 'The staff was assigned a job but the store is not found!')
          anotherRegion.manager_id = null
          await anotherRegion.save()
        }

        staff.store_assigned = resStore.id
        staff.job_title = jobTitle.STORE_MANAGER

        await staff.save()
      }
      await t.commit()
      return true
    } catch (error) {
      await t.rollback()
      return error
    }
  }

  /**
   * dynamic query criteria
   * 1-id 2-manager_id 3-region_id 4-state_id
   * @param {GetStore} query
   * @returns an exception or an array of results
   */
  async getStore (query: GetStore) {
    const criteria: Object = createCriteria(query, ['id', 'manager_id', 'region_id', 'state_id'])

    try {
      const staff = await StoreModel.findAll({
        where: criteria,
        order: [
          ['region_id'],
          ['state_id'],
          ['name'],
        ],
      })
      if (!staff) return new StoreException(errCode.STAFF_ERROR)

      return staff
    } catch (error) {
      return new DatabaseException()
    }
  }

  async setManager (p: SetStoreManager) {
    const { manager_id, store_id } = p
    const t = await sequelize.transaction()
    try {
      const staff = await StaffModel.findByPk(manager_id, { transaction: t })
      const store = await StoreModel.findByPk(store_id, { transaction: t })
      if (!staff) throw new StaffException(errCode.STAFF_NOT_FOUND)
      if (!store) throw new StoreException(errCode.STORE_NOT_FOUND)

      // if the store has a manager already, resign his/her job
      if (store.manager_id) {
        const res = await this.setStaffJobTitle(store.manager_id, t, jobTitle.SALESPERSON)
        if (isError(res)) throw res
      }

      // if the staff was a store manager before, set the previous store's manager_id to null
      if (staff.job_title == jobTitle.STORE_MANAGER) {
        const preStoreID = staff.store_assigned
        const preStore = await StoreModel.findByPk(preStoreID, { transaction: t })
        if (!preStore) throw new StoreException(errCode.STORE_NOT_FOUND, 'Previous Store Not Found.')
        preStore.manager_id = null
        await preStore.save()
      }

      // if the staff was a region manager before, set the previous region's manager_id to null
      if (staff.job_title == jobTitle.STORE_MANAGER) {
        const preRegionID = staff.region_assigned
        const preRegion = await RegionModel.findByPk(preRegionID, { transaction: t })
        if (!preRegion) throw new ConfigException(errCode.REGION_NOT_FOUND, 'Previous Region Not Found.')
        preRegion.manager_id = null
        await preRegion.save()
      }

      staff.store_assigned = store_id
      store.manager_id = manager_id
      staff.region_assigned = store.region_id
      staff.job_title = jobTitle.STORE_MANAGER

      await staff.save()
      await store.save()

      await t.commit()
      return true
    } catch (error) {
      await t.rollback()
      return error
    }
  }

  async setStaffJobTitle (id: number, t: any, title: number = jobTitle.SALESPERSON) {
    try {
      const staff = await StaffModel.findByPk(id, { transaction: t })
      if (staff) staff.job_title = title
      await staff.save()

      return true
    } catch (error) {
      await t.rollback()
      return error
    }
  }

  async deleteStore (p: any) {
    const { id } = p
    const t = await sequelize.transaction()

    if (!id) throw new ParameterException()
    console.log('id!!', id)
    try {
      const store = await StoreModel.findByPk(id, { transaction: t })
      if (!store) throw new StoreException(errCode.STORE_NOT_FOUND, 'Store does not exist...')

      const { manager_id } = store
      // if store has a manager, set his/her job_title to -1
      if (manager_id) {
        const staff = await StaffModel.findByPk(manager_id, { transaction: t })
        if (staff) {
          staff.job_title = jobTitle.UNASSIGNED
        }
        await staff.save()
      }

      await store.destroy()
      await t.commit()
      return true
    } catch (error) {
      await t.rollback()
      return error
    }
  }

  staffIsStoreManager (staff: any) {
    return staff.job_title == jobTitle.STORE_MANAGER
  }

  staffIsRegionManager (staff: any) {
    return staff.job_title == jobTitle.REGION_MANAGER
  }

  staffIsAssignedJob (staff: any) {
    return (staff?.job_title == jobTitle.STORE_MANAGER || staff?.job_title == jobTitle.REGION_MANAGER)
  }

}

export default new Store()