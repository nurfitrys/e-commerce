const chai = require('chai')
const chaiHttp = require('chai-http')
const expect = chai.expect
const app = require('../app')
const User = require('../models/user')
const Product = require('../models/product')
const {
    clearAll
} = require('../helpers/clearDb')
const { sign } = require('../helpers')

chai.use(chaiHttp)

let token = null
let adminToken = null
let prodId1 = null
let prodId2 = null

// before(function(done) {
//     const arr = [
//         User.create({
//                 name: 'Lidya',
//                 email: 'lidya@gmail.com',
//                 password: 'lidya'
//             }),
//         User
//             .create({
//                 name: 'Admin1',
//                 email: 'admin1@gmail.com',
//                 password: 'admin1',
//                 role: 'Admin'
//             }),
//         Product
//             .create({
//                 name: 'Lipstik',
//                 price: 200000,
//                 stock: 15
//             }),
//         Product
//             .create({
//                 name: 'Eyeliner',
//                 price: 500000,
//                 stock: 10
//             })
//     ]

//     Promise
//         .all(arr)
//         .then(([user, admin, prod1, prod2]) => {
//             token = sign(user._id, user.name, user.role)
//             adminToken = sign(admin._id, admin.name, admin.role)
//             prodId1 = prod1._id
//             prodId2 = prod2._id
//             done()
//             //clearAll(done)
//         })
//         .catch(err => {
//             console.log(err)
//         })
// })

// after(function(done) {
//     clearAll(done)
// })