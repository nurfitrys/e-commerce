const router = require('express').Router()
const ProductController = require('../controllers/product')
const { multer, sendUploadToGCS } = require('../helpers')
const { 
    authentication,
    productAuthorization
} = require('../middlewares/auth')

router.get('/', ProductController.listProduct)

router.use(authentication)
router.use(productAuthorization)

router.post('/', multer.single('image'), sendUploadToGCS, ProductController.addProduct)
router.put('/:id', multer.single('image'), sendUploadToGCS, ProductController.updateProduct)
router.delete('/:id', ProductController.deleteProduct)

module.exports = router