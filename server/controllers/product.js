const Product = require('../models/product')
const { ObjectId } = require('mongoose').Types

class ProductController {
    static addProduct(req, res, next) {
        let obj = {
            name: req.body.name,
            price: req.body.price,
            stock: req.body.stock
        }
        if (req.file) {
            obj.image = req.file.cloudStoragePublicUrl
        }
        Product.create(obj)
        .then(newProduct => {
            res.status(201).json(newProduct)
        })
        .catch(next)
    }

    static listProduct(req, res, next) {
        Product.find({})
        .sort({ created_at: -1})
        .then(products => {
            res.status(200).json(products)
        })
        .catch(next)
    }

    static detailProduct(req, res, next) {
        Product.findById(req.params.id)
        .then(product => {
            if (product) {
                res.status(200).json(product);
            }
            else {
                next({
                    code : 404,
                    message: 'Product not found'
                })
            }
        })
        .catch(next)
    }

    static updateProduct(req, res, next) {
        Product.updateOne({
            _id: req.params.id
        }, {
            $set: req.body
        })
        .then(result => {
            if (result.n && result.ok) {
                res.status(200).json(result)
            }
            else {
                next({
                    code : 404,
                    message: 'Product not found'
                })
            }
        })
        .catch(next)
    }

    static deleteProduct(req, res, next) {
        Product.deleteOne({
            _id: req.params.id
        })
        .then(result => {
            if (result.n && result.ok) {
                res.status(200).json(result)
            }
            else {
                next({
                    code : 404,
                    message: 'Product not found'
                })
            }
        })
        .catch(err => {
            if (RegExp('Cast to ObjectId failed').test(err.message)) {
                res.status(404).json({
                    message: err.message
                })
            }
            else {
                next(err)
            }
        })
    }
}

module.exports = ProductController