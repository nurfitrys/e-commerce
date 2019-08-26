const router             = require('express').Router()
const AuthController     = require('../controllers/auth')
const errorHandler       = require('../middlewares/errorHandler')
const CartRoute          = require('./cart')
const TransactionRoute   = require('./transaction')
const ProductRoute       = require('./product')
const { authentication } = require('../middlewares/auth')

router.post('/login', AuthController.login)
router.post('/register', AuthController.register)

router.use('/products', ProductRoute)

router.use(authentication)

router.use('/carts', CartRoute)
router.use('/transactions', TransactionRoute)

router.use(errorHandler)

module.exports = router