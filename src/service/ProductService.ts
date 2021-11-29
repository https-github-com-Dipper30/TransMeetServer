import BaseService from './BaseService'
import { GetProduct, GetRecommend, ListProduct, ProductType, SearchProduct } from '../types/Service'
import { createCriteria, getPagerFromQuery, getUnixTS, isError } from '../utils/tools'
import { DatabaseException, ParameterException, StoreException } from '../exception'
import { errCode } from '../config'
import { Op } from 'sequelize'
import ProductException from '../exception/ProductException'
import FileService from './FileService'
import { OrderStatus } from '../config/common'

const models = require('../../db/models')
const {
  Product: ProductModel,
  Store: StoreModel,
  Product_Store: ProductStore,
  Category: CategoryModel,
  Type: TypeModel,
  CartItem: CartItemModel,
  Rate: RateModel,
  Order: OrderModel,
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

  async updateProduct (product: ProductType|any) {
    try {
      const p = await ProductModel.findByPk(product.id)
      if (!p) throw new ProductException(errCode.PRODUCT_NOT_FOUND)

      delete product.id
      for (let prop in product) {
        p[prop] = product[prop]
      }
      await p.save()
      return true
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

  async listAllProducts () {
    const t = await sequelize.transaction()
    try {
      const products = await ProductModel.findAll({
        where: {
          listTS: null,
        },
      }, { transaction: t })
      if (!products) throw new ProductException(errCode.PRODUCT_NOT_FOUND)
      const arr = []
      const stores = await StoreModel.findAll()
      const sid = []
      for (let store of stores) sid.push(store.id)
      for (let p of products) {
        await this.listProduct({ pid: p.id, sid })
      }
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
      // delete every record in CartItem table where pid = pid
      const cartItem = await CartItemModel.findAll({
        where: {
          pid,
        },
      }, { transaction: t })
      for (let item of cartItem) {
        item.selected = false
        await item.save()
      }
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
    if (criteria.hasOwnProperty('sort')) {
      delete criteria['sort']
    }
    const includes = [
      {
        model: CategoryModel,
        attributes: ['name'],
      },
      {
        model: TypeModel,
        attributes: ['name', 'code'],
      },
      {
        model: RateModel,
        as: 'Ratings',
        attributes: ['value'],
      },
      {
        model: StoreModel,
        attributes: ['name', 'id'],
      },
    ]
    if (criteria?.showStores == false) {
      includes.pop()
    }
    delete criteria.showStores
    const [limit, offset] = getPagerFromQuery(query)
    // order
    let order = []
    if (query.sort == 'price') order = [['price'], ['amount', 'DESC']]
    else if (query.sort == 'price_desc') order = [['price', 'DESC'], ['amount', 'DESC']]
    else if (query.sort == 'rate') order = [['rate'], ['amount', 'DESC']]
    else if (query.sort == 'rate_desc') order = [['rate', 'DESC'], ['amount', 'DESC']]
    else order = [['id']]

    try {
      // TODO order by listed? available?
      const products = await ProductModel.findAndCountAll({
        where: criteria,
        order,
        limit,
        offset,
        distinct: true, // avoid wrong count due to include
        include: includes,
        // attributes: {
        //   includes: [sequelize.fn('AVG', sequelize.col('Ratings.value')), 'avgRating'],
        // },
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
      return error
    }
  }

  async getRecommend (data: GetRecommend) {
    try {
      const { type } = data
      let arr: number[] = []
      if (type == 'rate') {
        // get products by ratings desc
        const rates = await RateModel.findAll({
          attributes: {
            exclude: ['id', 'createdAt', 'updatedAt', 'value'],
            include: [[models.sequelize.fn('AVG', models.sequelize.col('value')), 'avgRate']],
          },
          group: ['pid'],
        })
        rates.sort((a: any, b: any) => b.dataValues.avgRate - a.dataValues.avgRate)
        for (let i of rates) {
          arr.push(i.dataValues.pid)
        }
        return await this.findAllRecommend(arr)
      } else if (type == 'sold') {
        // get products by number of orders in recent month
        const current = getUnixTS()
        const aMonthBefore = current - 30 * 24 * 60 * 60
        const orders = await OrderModel.findAll({
          where: {
            status: OrderStatus.FINISHED,
            time: {
              [Op.gt]: aMonthBefore,
            },
          },
          attributes: {
            exclude: ['id', 'uid', 'sid', 'rid', 'staff', 'price', 'amount', 'status', 'rate', 'id', 'time'],
            include: [[models.sequelize.fn('COUNT', models.sequelize.col('pid')), 'sold']],
          },
          group: ['pid'],
        })
        orders.sort((a: any, b: any) => b.dataValues.sold - a.dataValues.sold)
        for (let i of orders) {
          arr.push(i.dataValues.pid)
        }
        return await this.findAllRecommend(arr)
      } else {
        return await this.findAllRecommend(arr)
      }
      // find products by id arr
      
    } catch (error) {
      return error
    }
  }

  async findAllRecommend (arr: number[]) {
    try {
      const products = await ProductModel.findAll({
        where: {
          id: {
            [Op.in]: arr,
          },
          listTS: {
            [Op.not]: null,
          },
          amount: {
            [Op.gt]: 0,
          },
        },
        include: [
          {
            model: CategoryModel,
            attributes: ['name'],
          },
          {
            model: TypeModel,
            attributes: ['name', 'code'],
          },
          {
            model: RateModel,
            as: 'Ratings',
            attributes: ['value'],
          },
        ],
        limit: 5,
        order: [['price']],
      })
      // read image file
      for (let product of products) {
        let p = product.dataValues
        const images = await FileService.readProductImage(p.id)
        if (images && images.length > 0) product.dataValues.imgList = images
      }
      return products
    } catch (error) {
      return error
    }
  }

  async searchProduct (query: SearchProduct) {
    try {
      const { search } = query
      const products = await ProductModel.findAll({
        where: {
          listTS: {
            [Op.not]: null,
          },
          amount: {
            [Op.gt]: 0,
          },
          [Op.or]: [
            {
              name: {
                [Op.like]: `%${search}%`,
              },
            },
            {
              description: {
                [Op.like]: `%${search}%`,
              },
            },
          ],
        },
        include: [
          {
            model: CategoryModel,
            attributes: ['name'],
          },
          {
            model: TypeModel,
            attributes: ['name', 'code'],
          },
          {
            model: RateModel,
            as: 'Ratings',
            attributes: ['value'],
          },
          {
            model: StoreModel,
            attributes: ['name', 'id'],
          },
        ],
        limit: 10,
      })
      for (let product of products) {
        let p = product.dataValues
        const images = await FileService.readProductImage(p.id)
        if (images && images.length > 0) product.dataValues.imgList = images
      }
      return products
    } catch (error) {
      return error
    }
  }

}

export default new Product()