import BaseService from './BaseService'
import { GetProduct, ListProduct, ProductType } from '../types/Service'
import { createCriteria, getPagerFromQuery, getUnixTS, isError } from '../utils/tools'
import { DatabaseException, ParameterException, StoreException } from '../exception'
import { errCode } from '../config'
import { Op } from 'sequelize'
import ProductException from '../exception/ProductException'
import FileService from './FileService'

const models = require('../../db/models')
const {
  Product: ProductModel,
  Store: StoreModel,
  Product_Store: ProductStore,
  Category: CategoryModel,
  Type: TypeModel,
} = models
const { sequelize } = require('../../db/models')

class Product extends BaseService {

  constructor () {
    super()
  }

  async addProduct (product: ProductType) {
    try {
      const currentUnixTS = getUnixTS()
      const [res, created] = await ProductModel.findOrCreate({
        where: {
          name: product.name,
          cate: product.cate,
          type: product.type,
        },
        defaults: { 
          ...product,
          listTS: null,
          createTS: currentUnixTS,
        },
      })
      if (!created) throw new ProductException(errCode.PRODUCT_EXISTS)
      return res
    } catch (error) {
      return error
    }
  }

  async listProduct (p: ListProduct) {
    const t = await sequelize.transaction()
    const { pid, sid } = p
    try {
      const product = await ProductModel.findByPk(pid, { transaction: t })
      if (!product) throw new ProductException(errCode.PRODUCT_NOT_FOUND)
      if (product.listTS) throw new ProductException(errCode.PRODUCT_ALREADY_LISTED)

      product.listTS = getUnixTS()
      const storeIDs = await StoreModel.findAll({
        where: {
          id: { [Op.in]: sid },
        },
        transaction: t,
      })
      await product.setStores(storeIDs)
      await product.save()
      
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
      const product = await ProductModel.findByPk(pid, { transaction: t })
      if (!product) throw new ProductException(errCode.PRODUCT_NOT_FOUND)
      if (!product.listTS) throw new ProductException(errCode.PRODUCT_NOT_YET_LISTED, 'The product is not listed.')
      
      // delete every record in Product_Stores table where pid = pid
      await ProductStore.destroy({
        where: {
          pid,
        },
        transaction: t,
      })
      product.listTS = null
      await product.save()
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
      criteria.id = query.pid
    } else if (sid) {
      const ps = await ProductStore.findAll({
        where: {
          sid: query.sid,
        },
      })
      if (!ps) throw new ProductException(errCode.PRODUCT_ERROR, 'sid error')
      if (ps.length == 0) throw new ProductException(errCode.PRODUCT_NOT_YET_LISTED, 'This store has no listed product, or the product id you provide is not available in this store.')
      const pids = ps.map((e: any) => e.dataValues?.pid)
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

    if (criteria.hasOwnProperty('page')) {
      delete criteria['page']
    }
    if (criteria.hasOwnProperty('size')) {
      delete criteria['size']
    }
    if (criteria.hasOwnProperty('pic')) {
      delete criteria['pic']
    }
    const [limit, offset] = getPagerFromQuery(query)
    try {
      // TODO order by listed? available?
      ProductModel.belongsTo(CategoryModel, { foreignKey: 'cate', targetKey: 'code' })
      ProductModel.belongsTo(TypeModel, { foreignKey: 'type', targetKey: 'code' })
      const products = await ProductModel.findAndCountAll({
        where: criteria,
        order: [
          ['id', 'DESC'],
          ['cate'],
          ['type'],
          ['price', 'DESC'],
          ['amount', 'DESC'],
        ],
        limit,
        offset,
        include: [
          {
            model: CategoryModel,
            attributes: ['name'],
          },
          {
            model: TypeModel,
            attributes: ['name'],
          },
          {
            model: StoreModel,
            attributes: ['name', 'id'],
          },
        ],
      })
      if (!products) return new ProductException(errCode.PRODUCT_ERROR)

      if (query.pic) {
        // read image file
        for (let product of products.rows) {
          let p = product.dataValues
          const images = await FileService.readProductImage(p.id)
          if (images && images.length > 0) product.dataValues.imgList = images
        }
      }
      
      return products
    } catch (error) {
      return new DatabaseException()
    }
  }

}

export default new Product()