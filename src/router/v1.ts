import { Router } from 'express'
import { 
  AuthController,
  ConfigController,
  StoreController,
  ProductController,
  StaffController,
} from '../controller/index'

const router: Router = Router()

// auth
router.post('/register', AuthController.register)
router.post('/login', AuthController.login)
router.post('/token', AuthController.getInfoByToken) // login using token

// config
router.get('/states', ConfigController.getStates)
router.get('/businessTypes', ConfigController.getBusinessTypes)
router.get('/regions', ConfigController.getRegions)
router.get('/categories', ConfigController.getCategories)
router.get('/types', ConfigController.getTypes)
router.post('/productImage', ConfigController.upload)

// staff
router.post('/staff', StaffController.addStaff)
router.get('/staff', StaffController.getStaff)

// store
router.post('/stores', StoreController.addStore)
router.get('/stores', StoreController.getStore)
router.get('/deleteStore', StoreController.deleteStore)
router.post('/setStoreManager', StoreController.setManager)

// product
router.post('/addProduct', ProductController.addProduct)
router.post('/updateProduct', ProductController.updateProduct)
router.get('/products', ProductController.getProduct)
router.post('/list', ProductController.listProduct)
router.post('/unlist', ProductController.unlistProduct)
router.post('/deleteProduct', ProductController.deleteProduct)
router.get('/productImage', ProductController.getProductImage)

// account
// router.post('/checkAccount', AccountController.checkAccount)
// router.post('/register', AccountController.register)
// router.post('/login', AccountController.login)

// user
// router.get('/user/:id', UserController.getUserByID)
// router.post('/updateUser', UserController.updateUser)
// router.post('/user', UserController.createUser)

module.exports = router