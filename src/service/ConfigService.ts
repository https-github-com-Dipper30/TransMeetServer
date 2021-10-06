import BaseService from "./BaseService"

const models = require('../../db/models')
const { State } = models

class Config extends BaseService {

  constructor() {
    super()
  }

  async getStates (id: any) {
    try {
      return await State.findAll()
    } catch (error) {
      return false
    }
  }

  async getStatesInRegion (region_id: number) {
    try {
      return await State.findAll({
        where: {
          region_id: region_id
        }
      })
    } catch (error) {
      return false
    }
  }

}

module.exports = new Config()