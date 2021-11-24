import { role } from '../config/auth'
import { Account } from '../types/common'
import { User, HomeCustomer, Admin, BusinessCustomer } from '../types/User'
import BaseService from './BaseService'
import { encryptMD5, omitFields } from '../utils/tools'
import { AddToCart, GetCart, IsInCart, UpdateCart } from '../types/Service'
import { CartException, ConfigException, DatabaseException } from '../exception'
import { errCode } from '../config'

const models = require('../../db/models/index.js')
const { sequelize } = require('../../db/models')
const {
  User: UserModel,
  Home_Customer: Home_Customer,
  Business_Customer: Business_Customer,
  Admin: AdminModel,
  Access: AccessModel,
  Product: ProductModel,
  CartItem: CartItemModel,
  Category: CategoryModel,
  Store: StoreModel,
  Product_Store,
  Type: TypeModel,
} = models

// const Op = Sequelize.Op

class Cart extends BaseService {
  constructor () {
    super()
  } 

  /**
   * add a product into cart, bind with a user id
   * 1. check if the product exists and is listed
   * 2. check if the store exists and has the product
   * 3. check if the user exists
   * @param item 
   * @returns 
   */
  async addToCart (item: AddToCart): Promise<any> {
    try {
      const { uid, pid, sid } = item
      const user = await UserModel.findByPk(uid)
      if (!user) throw new CartException(errCode.CART_ERROR, 'Can\'t find user.')
      const product = await ProductModel.findByPk(pid)
      if (!product) throw new CartException(errCode.CART_ERROR, 'Can\'t find product.')
      if (!product.listTS) throw new CartException(errCode.CART_ERROR, 'Product is not for sell now.')

      const ps = await Product_Store.findOne({
        where: {
          pid,
          sid,
        },
      })
      if (!ps) throw new CartException(errCode.CART_ERROR, 'The store does not have the product.')

      const cartItem = await CartItemModel.findOne({
        where: {
          uid,
          pid,
          sid,
        },
      })
      if (cartItem) throw new CartException(errCode.CART_ERROR, 'Cart item already exists.')

      const added = CartItemModel.create({ ...item, selected: true })
      if (!added) throw new CartException()

      return added
    } catch (error) {
      return error
    }
  }

  async updateCart (p: UpdateCart, userID: number) {
    try {
      const { id, amount, selected } = p
      const cartItem = await CartItemModel.findByPk(id)
      if (!cartItem) throw new CartException(errCode.CART_ERROR, 'Cart Not Found.')
      if (cartItem.uid != userID) throw new ConfigException(errCode.ACCESS_ERROR, 'Not Authorized.')
      
      if (amount) cartItem.amount = amount
      if (selected == true || selected == false) cartItem.selected = selected
      await cartItem.save()
    } catch (error) {
      return error
    }
  }

  async getCartItems (p: GetCart) {
    try {
      // CartItemModel.belongsTo(ProductModel, {
      //   foreignKey: 'pid',
      //   targetKey: 'id',
      // })
      const { uid } = p
      const user = await UserModel.findByPk(uid)
      if (!user) throw new CartException(errCode.CART_ERROR, 'User not exists.')
      
      const cart = await CartItemModel.findAndCountAll({
        where: { uid },
        distinct: true,
        attributes: ['id', 'selected', 'sid', 'amount'],
        include: [
          {
            model: ProductModel,
            include: [
              {
                model: CategoryModel,
                attributes: ['name'],
              },
              {
                model: TypeModel,
                attributes: ['name'],
              },
            ],
          },
          {
            model: StoreModel,
            attributes: ['id', 'name'],
          },
        ],
        // include: [
          // { 
            // model: ProductModel,
            
          // },
        // ],
      })
      if (!cart) throw new CartException(errCode.CART_ERROR)
      return cart
    } catch (error) {
      return error
    }
    
  }

  async isInCart (p: IsInCart): Promise<any> {
    try {
      const { uid, pid, sid } = p
      const cartItem = await CartItemModel.findOne({
        where: {
          uid,
          pid,
          sid,
        },
      })
      if (cartItem) return true
      else return false
    } catch (error) {
      return error
    }
  }

  async deleteCart (p: { id: number }, userID: number): Promise<any> {
    try {
      const { id } = p
      const item = await CartItemModel.findByPk(id)
      if (item.uid != userID) throw new CartException(errCode.CART_ERROR, 'Not Authorized.')
      return await item.destroy()
    } catch (error) {
      return error
    }
  }

}

export default new Cart()