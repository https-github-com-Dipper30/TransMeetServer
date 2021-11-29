import { Router } from 'express'
import CartController from '../controller/CartController'
import { 
  AuthController,
  ConfigController,
  StoreController,
  ProductController,
  StaffController,
  OrderController,
} from '../controller/index'

const router: Router = Router()

// auth
router.post('/register', AuthController.register)
router.post('/login', AuthController.login)
router.get('/userInfo', AuthController.getUserInfo)
router.post('/token', AuthController.getInfoByToken) // login using token
router.post('/updateUserInfo', AuthController.update)

// config
router.get('/states', ConfigController.getStates)
router.get('/businessTypes', ConfigController.getBusinessTypes)
router.get('/regions', ConfigController.getRegions)
router.get('/categories', ConfigController.getCategories)
router.get('/types', ConfigController.getTypes)
router.post('/productImage', ConfigController.upload)
router.get('/profitByRegion', ConfigController.getProfitByRegion)
router.get('/consumption', ConfigController.getConsumptionOfUsers)

// staff
router.post('/staff', StaffController.addStaff)
router.get('/staff', StaffController.getStaff)

// store
router.post('/store', StoreController.addStore)
router.get('/stores', StoreController.getStore)
router.get('/deleteStore', StoreController.deleteStore)
router.post('/setStoreManager', StoreController.setManager)

// product
router.post('/addProduct', ProductController.addProduct)
router.post('/updateProduct', ProductController.updateProduct)
router.get('/products', ProductController.getProduct)
router.get('/product', ProductController.searchProduct)
router.get('/recommend', ProductController.getRecommend)
router.post('/list', ProductController.listProduct)
router.post('/listAll', ProductController.listAllProducts)
router.post('/unlist', ProductController.unlistProduct)
router.post('/deleteProduct', ProductController.deleteProduct)
router.get('/productImage', ProductController.getProductImage)

// cart
router.post('/addToCart', CartController.addToCart)
router.post('/updateCart', CartController.updateCart)
router.post('/deleteCart', CartController.deleteCart)
router.get('/cart', CartController.getCartItems)
router.post('/isInCart', CartController.isInCart)

// order
router.post('/placeOrder', OrderController.placeOrder)
router.post('/rateOrder', OrderController.rateOrder)
router.get('/orders', OrderController.getOrders)

// account
// router.post('/checkAccount', AccountController.checkAccount)
// router.post('/register', AccountController.register)
// router.post('/login', AccountController.login)

// user
// router.get('/user/:id', UserController.getUserByID)
// router.post('/updateUser', UserController.updateUser)
// router.post('/user', UserController.createUser)

module.exports = router