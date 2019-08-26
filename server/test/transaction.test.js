const chai = require('chai')
const chaiHttp = require('chai-http')
const expect = chai.expect
const app = require('../app')
const User = require('../models/user')
const Product = require('../models/product')
const Transaction = require('../models/transaction')
const {
    clearProduct,
    clearUser,
    clearTransaction
} = require('../helpers/clearDb')
const { sign } = require('../helpers')

chai.use(chaiHttp)