import { Router } from 'express'
import { UserController } from '../controller/index'

const router: Router = Router()

router.get('/user', UserController.getUserByID)

// account
// router.post('/checkAccount', AccountController.checkAccount)
// router.post('/register', AccountController.register)
// router.post('/login', AccountController.login)

// user
// router.get('/user/:id', UserController.getUserByID)
// router.post('/updateUser', UserController.updateUser)
// router.post('/user', UserController.createUser)


module.exports = router