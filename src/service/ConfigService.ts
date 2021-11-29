import BaseService from './BaseService'
import { Op } from 'sequelize'
const models = require('../../db/models')
const { State, Business_Type, Region, Category, Type, sequelize } = models

class Config extends BaseService {

  constructor () {
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

  /**
   * find profit of each region and order by total profit
   * @param cate_code 
   * @returns 
   */
  async getRegionalProfit () {
    try {
      const query = `SELECT SUM(price) profit,id rid, r.name FROM (
        SELECT price,sid,s.region_id FROM Orders o LEFT JOIN Stores s ON o.sid=s.id) t LEFT JOIN Regions r ON t.region_id=r.id GROUP BY rid ORDER BY profit DESC;`
      const [profits, metadata] = await sequelize.query(query)
      if (!profits) return []
      return profits
    } catch (error) {
      return error
    }
  }

  /**
   * get total consumption of each user
   * @param cate_code 
   * @returns 
   */
   async getConsumptionOfUsers () {
    try {
      const query = 'SELECT SUM(o.price) consumption,u.id uid,u.username,u.role_id FROM orders o LEFT JOIN Users u ON o.uid=u.id GROUP BY uid ORDER BY consumption DESC LIMIT 10;'
      const [users, metadata] = await sequelize.query(query)
      if (!users) return []
      return users
    } catch (error) {
      return error
    }
  }

}

export default new Config()