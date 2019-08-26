const router                       = require('express').Router()
const TransactionCon               = require('../controllers/transaction')
const { transactionAuthorization } = require('../middlewares/auth')

router.get('/', TransactionCon.getAll)
router.get('/:id', TransactionCon.getOne)
router.post('/', TransactionCon.create)
router.patch('/:id/:productId', transactionAuthorization, TransactionCon.update)

module.exports = router