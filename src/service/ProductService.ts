import BaseService from './BaseService'
import { GetProduct, ListProduct, ProductType } from '../types/Service'
import { createCriteria, getUnixTS, isError } from '../utils/tools'
import { DatabaseException, ParameterException, StoreException } from '../exception'
import { errCode } from '../config'
import { Op } from 'sequelize'
import ProductException from '../exception/ProductException'

const models = require('../../db/models')
const {
  Product: ProductModel,
  Product_Store: ProductStore,
} = models
const { sequelize } = require('../../db/models')

class Product extends BaseService {

  constructor () {
    super()
  }

  async addProduct (product: ProductType) {
    try {
      const [res, created] = await ProductModel.findOrCreate({
        where: {
          name: product.name,
        },
        defaults: { 
          ...product,
          listTS: product.listTS || null,
          imgSrc: product.imgSrc || null,
        },
      })
      if (!created) throw new ProductException(errCode.PRODUCT_EXISTS)
      return true
    } catch (error) {
      return error
    }
  }

  async listProduct (p: ListProduct) {
    const t = await sequelize.transaction()
    const { pid, sid } = p
    try {
      const product = await ProductModel.findByPk(pid)
      if (!product) throw new ProductException(errCode.PRODUCT_NOT_FOUND)
      if (product.listTS) throw new ProductException(errCode.PRODUCT_ALREADY_LISTED)

      // iterate each store id, bind it to a pid as a record
      for (let storeID of sid) {
        await ProductStore.findOrCreate({
          where: {
            pid,
            sid: storeID,
          },
          defaults: {
            pid,
            sid: storeID,
          },
          transaction: t,
        })
      }

      // now update the product's listTS
      const ts = getUnixTS()
      await ProductModel.update({
        listTS: ts,
      }, {
        where: {
          id: pid,
        },
      }, {
        transaction: t,
      })

      await t.commit()
      return true
    } catch (error) {
      await t.rollback()
      return error
    }
  }

  async unlistProduct (p: {pid: number}) {
    const t = await sequelize.transaction()
    const { pid } = p
    try {
        const product = await ProductModel.findByPk(pid)
        if (!product) throw new ProductException(errCode.PRODUCT_NOT_FOUND)
        if (!product.listTS) throw new ProductException(errCode.PRODUCT_NOT_YET_LISTED, 'The product is not listed.')
        
        // delete every record in Product_Stores table where pid = pid
        await ProductStore.destroy({
          where: {
            pid,
          },
          transaction: t,
        })
      // now update the product's listTS to null
      await ProductModel.update({
        listTS: null,
      }, {
        where: {
          id: pid,
        },
      }, {
        transaction: t,
      })
      await t.commit()
      return true
    } catch (error) {
      await t.rollback()
      return error
    }
  }

  async deleteProduct (p: {pid: number}) {
    const t = await sequelize.transaction()
    const { pid } = p
    try {
      const product = await ProductModel.findByPk(pid)
      if (!product) throw new ProductException(errCode.PRODUCT_NOT_FOUND, 'The product does not exist at all!')

      // delete every record in Product_Stores table where pid = pid
      await ProductStore.destroy({
        where: {
          pid,
        },
        transaction: t,
      })
      // delete
      await ProductModel.destroy({
        where: {
          id: pid,
        },
        transaction: t,
      })
      await t.commit()
      return true
    } catch (error) {
      await t.rollback()
      return error
    }
  }

  async getProduct (query: GetProduct) {
    const criteria: any = createCriteria(query)
    const { listed, available, pid, sid } = criteria

    if (pid) {
      criteria.id = { [Op.in]: [pid] }
    } else if (sid) {
      const ps = await ProductStore.findAll({
        where: {
          sid,
        },
      })
      if (!ps) throw new ProductException(errCode.PRODUCT_ERROR, 'sid error')
      if (ps.length == 0) throw new ProductException(errCode.PRODUCT_NOT_YET_LISTED, 'This store has no listed product, or the product id you provide is not available in this store.')
      const pids = ps.map((e: any) => e.dataValues?.pid)
      console.log(pids)
      criteria.id = { [Op.in]: pids }
    }
    delete criteria.sid
    delete criteria.pid

    // if there is price included, find products with price less than given price
    if (criteria.hasOwnProperty('price')) {
      Object.defineProperty(criteria, 'price', {
        value: {
          [Op.lt]: query.price,
        },
      })
    }
    if (criteria.hasOwnProperty('pid')) {
      criteria.id = { [Op.eq]: query.pid }
      delete criteria.pid
    }
    if (criteria.hasOwnProperty('listed')) {
      delete criteria['listed']
      // find listed products
      if (listed) criteria.listTS = { [Op.not]: null }
      // find unlisted products
      else criteria.listTS = { [Op.is]: null }
    }
    if (criteria.hasOwnProperty('available')) {
      delete criteria['available']
      // find products whose amount is greater than 0
      if (available) criteria.amount = { [Op.gt]: 0 }
      // find unavailable products
      else criteria.amount = { [Op.eq]: 0 }
    }
    console.log('c', criteria)
    try {
      // TODO order by listed? available?
      const products = await ProductModel.findAll({
        where: criteria,
        order: [
          ['cate'],
          ['type'],
          ['price', 'DESC'],
          ['amount', 'DESC'],
        ],
      })
      if (!products) return new ProductException(errCode.PRODUCT_ERROR)

      return products
    } catch (error) {
      return new DatabaseException()
    }
  }

}

export default new Product()