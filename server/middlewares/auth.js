const User       = require('../models/user')
const Transaction    = require('../models/transaction')
const Product    = require('../models/product')
const { decode } = require('../helpers')

module.exports = {
    authentication: function (req, res, next) {
        try {
            const decoded  = decode(req.headers.accesstoken)
            req.authenticatedUser = decoded
            User.findById(decoded._id)
            .then(user => {
                if (user) {
                    next()
                }
                else {
                    next({
                        message : `User is not found`,
                        code : 401
                    })
                }
            })
            .catch(next)
        }
        catch (err) {
            next({
                code : 401,
                message: 'Please login to continue'
            })
        }
    },

    transactionAuthorization: function (req, res, next) {
        Transaction.findById(req.params.id)
        .then(transaction => {
            if (transaction) {
                console.log(transaction)
                if (String(transaction.buyer) != req.authenticatedUser._id && req.authenticatedUser.role !== 'Admin') {
                    next({
                        code: 403,
                        message: 'Forbidden'
                    })
                }
                else {
                    next()
                }
            }
            else {
                next({
                    code: 404,
                    message: `Transaction is not found`
                })
            }
        })
        .catch(next)
    },

    productAuthorization: function (req, res, next) {
        console.log(req.authenticatedUser.role === 'Admin')
        if (req.authenticatedUser.role == 'Admin') {
            next()
        }
        else {
            next({
                code: 403,
                message: 'Forbidden'
            })
        }
    },
}