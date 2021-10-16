import BaseService from './BaseService'
import { StoreType, GetStore } from '../types/Service'
import { createCriteria } from '../utils/tools'
import { DatabaseException, StoreException } from '../exception'
import { errCode } from '../config'

const models = require('../../db/models')
const { Store: StoreModel } = models

class Store extends BaseService {

  constructor () {
    super()
  }

  async addStore (store: StoreType) {
    try {
      const [res, created] = await StoreModel.findOrCreate({
        where: {
          name: store.name,
          state_id: store.state_id,
        },
        defaults: store,
      })
      if (created && res) return true
      return false
    } catch (error) {
      return new DatabaseException()
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

}

export default new Store()