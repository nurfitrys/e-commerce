const User = require('../models/user')
const Product = require('../models/product')
const Transaction = require('../models/transaction')

module.exports = {
    clearUser(done) {
        if (process.env.NODE_ENV == 'test') {
            User.deleteMany({})
            .then(() => {
                done()
            })
            .catch(err => {
                console.log(err)
            })
        } 
    },

    clearProduct(done) {
        if (process.env.NODE_ENV == 'test') {
            Product.deleteMany({})
            .then(() => {
                done()
            })
            .catch(err => {
                console.log(err)
            })
        }
    },

    clearTransaction(done) {
        if (process.env.NODE_ENV == 'test') {
            Transaction.deleteMany({}).then(() => {
                done()
            })
            .catch(err => {
                console.log(err)
            })
        }
    },

    clearAll(done) {
        if (process.env.NODE_ENV == 'test') {
            Promise.all([
                User.deleteMany({}),
                Product.deleteMany({}),
                Transaction.deleteMany({})    
            ])
            .then(() => {
                console.log('done')
                done()
            })
            .catch(err => {
                console.log(err)
            })
        }
    }
}