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

// config
router.get('/states', ConfigController.getStates)
router.get('/businessTypes', ConfigController.getBusinessTypes)
router.get('/regions', ConfigController.getRegions)

// staff
router.post('/staff', StaffController.addStaff)
router.get('/staff', StaffController.getStaff)

// store
router.post('/store', StoreController.addStore)
router.get('/store', StoreController.getStore)
router.get('/deleteStore', StoreController.deleteStore)
router.post('/setStoreManager', StoreController.setManager)

// product
router.post('/addProduct', ProductController.addProduct)
router.get('/product', ProductController.getProduct)
router.post('/list', ProductController.listProduct)
router.post('/unlist', ProductController.unlistProduct)
router.post('/deleteProduct', ProductController.deleteProduct)

// account
// router.post('/checkAccount', AccountController.checkAccount)
// router.post('/register', AccountController.register)
// router.post('/login', AccountController.login)

// user
// router.get('/user/:id', UserController.getUserByID)
// router.post('/updateUser', UserController.updateUser)
// router.post('/user', UserController.createUser)

module.exports = router