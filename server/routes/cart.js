const router         = require('express').Router()
const CartController = require('../controllers/cart')

router.get('/', CartController.getCart)
router.patch('/:productId', CartController.addProduct)
router.delete('/:productId', CartController.removeProduct)

module.exports = router