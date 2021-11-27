import BaseService from './BaseService'
import { GetProduct, ListProduct, ProductType, Order as OrderType, PlaceOrder, GetOrder } from '../types/Service'
import { createCriteria, encryptMD5, generateDateByTs, getPagerFromQuery, getTS, getUnixTS, isError } from '../utils/tools'
import { DatabaseException, ParameterException, StoreException } from '../exception'
import { errCode } from '../config'
import { Op } from 'sequelize'
import ProductException from '../exception/ProductException'
import FileService from './FileService'
import StaffService from './StaffService'

const models = require('../../db/models')
const {
  Product: ProductModel,
  Store: StoreModel,
  Product_Store: ProductStore,
  Category: CategoryModel,
  Type: TypeModel,
  CartItem: CartItemModel,
  Order: OrderModel,
} = models
const { sequelize } = require('../../db/models')
import OrderQueue from '../utils/OrderQueue'
import { OrderStatus } from '../config/common'
import { time } from 'console'

class Order extends BaseService {

  constructor () {
    super()
  }

  async handleOrders (orders: PlaceOrder) {
    try {
      const orderQueue = OrderQueue.getInstance()
      const promiseArr: any[] = []
      const resultList: any[] = []
      // randomly choose a staff in the store to process the order
      orders.orders.forEach(o => promiseArr.push(StaffService.getRandomStaffByStoreId(o.sid)))
      return Promise.all(promiseArr).then(async r => {
        const ids: number|null[] = r.map(staff => (!staff || staff.count == 0) ? null : staff.id)
        const formattedOrders: any[] = orders.orders.map((o, index) => {
          return {
            pid: o.pid,
            amount: o.amount,
            price: o.price,
            sid: o.sid,
            time: orders.time,
            uid: orders.uid,
            staff: ids[index],
            status: OrderStatus.INITIATED,
          }
        })
        orderQueue.add(formattedOrders)

        while (!orderQueue.isEmpty()) {
          const order = orderQueue.peek()
          const placed = await this.placeOrder(order)
          resultList.push(placed)
          orderQueue.poll()
        }
        return resultList
      }).catch(err => err)
      
    } catch (error) {
      return error
    }
  }

  async placeOrder (order: OrderType | null): Promise<any> {
    if (order == null) return
    const t = await sequelize.transaction()
    try {
      const product = await ProductModel.findByPk(order.pid)
      if (!product || isError(product)) throw new ProductException(errCode.PRODUCT_NOT_FOUND)
      if (product.amount < order.amount) throw new ProductException(errCode.PRODUCT_SOLD_OUT)
      if (!product.listTS) throw new ProductException(errCode.PRODUCT_NOT_YET_LISTED)
      product.amount -= order.amount

      // generate order id
      order.id = String(this.generateOrderId(order.time, order.uid, order.pid, order.sid))
      order.time = order.time ? Math.floor(order.time / 1000) : getTS()

      const created = await OrderModel.create({ ...order, status: OrderStatus.FINISHED }, { transaction: t })

      let r = {}
      if (isError(created)) {
        r = {
          code: created.code,
          msg: created.message,
          id: order.id,
          result: false,
        }
      } else {
        r = {
          code: 200,
          msg: 'sucess',
          id: order.id,
          result: true,
        }
      }

      await product.save()

      // delete cart item
      await CartItemModel.destroy({
        where: {
          pid: order.pid,
          uid: order.uid,
          sid: order.sid,
        },
      })
      await t.commit()
      return r
    } catch (error) {
      await t.rollback()
      return error
    }
  }

  /**
   * get orders by dynamic searching criteria
   * { uid, pid, sid, rid, oid, price, staff_assigned, page, size }
   * @param query
   * @returns 
   */
  async getOrders (query: GetOrder): Promise<any> {
    if (!query) return
    const criteria: any = createCriteria(query, ['uid', 'oid', 'pid', 'sid', 'rid', 'price', 'staff_assigned'])

    // modify price criteria, >= price
    if (criteria.hasOwnProperty('price')) {
      Object.defineProperty(criteria, 'price', {
        value: {
          [Op.gt]: query.price,
        },
      })
    }

    // reset pager query
    if (criteria.hasOwnProperty('page')) delete criteria['page']
    if (criteria.hasOwnProperty('size')) delete criteria['size']
    const [limit, offset] = getPagerFromQuery(query)

    // const t = await sequelize.transaction()
    try {
      const orders = await OrderModel.findAndCountAll({
        where: criteria,
        order: [
          ['price', 'desc'],
          ['time', 'desc'],
        ],
        limit,
        offset,
        distinct: true,
        include: [
          {
            model: ProductModel,
          },
          {
            model: StoreModel,
          },
        ],
      })

      // await t.commit()
      return orders
    } catch (error) {
      // await t.rollback()
      return error
    }
  }

  /**
   * 
   * @param time 
   * const criteria: any = createCriteria(query, ['id', 'region_assigned', 'store_assigned', 'job_title', 'salary'])
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
   * @param uid 
   * @param pid 
   * @param sid 
   * @returns 
   */

  generateOrderId (time: number|undefined, uid: any, pid: number, sid: number): String {
    if (!time) time = getTS()
    return generateDateByTs(time) + encryptMD5(`${time.toString().substring(10, 13)}&${uid}&${sid}&${pid}`)
  }

}

export default new Order()