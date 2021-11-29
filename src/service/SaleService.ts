import BaseService from './BaseService'

const models = require('../../db/models')
const { State, Business_Type, Region, Category, Type } = models

class Sale extends BaseService {

  constructor () {
    super()
  }

  async getRegionalProfit (id: any) {
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
          region_id: region_id,
        },
      })
    } catch (error) {
      return false
    }
  }

  async getBusinessTypes () {
    try {
      return await Business_Type.findAll()
    } catch (error) {
      return false
    }
  }

  async getRegions () {
    try {
      return await Region.findAll()
    } catch (error) {
      return false
    }
  }

  async getCategories () {
    try {
      return await Category.findAll()
    } catch (error) {
      return error
    }
  }

  async getTypes (cate_code: number) {
    try {
      const criteria = cate_code ? { cate_code: cate_code } : {}
      return await Type.findAll({
        where: criteria,
        include: [
          {
            model: Category,
            attributes: ['name'],
          },
        ],
      })
    } catch (error) {
      return error
    }
  }

}

export default new Sale()