import BaseService from "./BaseService"
import { StoreType } from '../types/Service'

const models = require('../../db/models')
const { Store: StoreModel } = models

class Store extends BaseService {

  constructor() {
    super()
  }

  async addStore (store: StoreType) {
    try {
      const [res, created] = await StoreModel.findOrCreate({
        where: {
          name: store.name
        },
        defaults: store
      })
      if (created && res) return true
      return false
    } catch (error) {
      return false
    }
  }

}

export default new Store()