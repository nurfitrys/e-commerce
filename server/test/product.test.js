const chai = require('chai')
const chaiHttp = require('chai-http')
const expect = chai.expect
const app = require('../app')
const { clearProduct } = require('../helpers/clearDb')
const User = require('../models/user')
const { sign } = require('../helpers')

chai.use(chaiHttp)

let token = null;
let adminToken = null;

before(function(done) {
    this.timeout(10000)
    let arr = [
        User
            .create({
                name: 'Cantik',
                email: 'cantik@gmail.com',
                password: 'cantik'
            }),
        User
            .create({
                name: 'Admin',
                email: 'admin@gmail.com',
                password: 'admin',
                role: 'Admin'
            })

    ]
    Promise
        .all(arr)
        .then(([user, admin]) => {
            token = sign(user._id, user.name, user.role)
            adminToken = sign(admin._id, admin.name, admin.role)
            done()
            //clearProduct(done)
        })
        .catch(err => {
            console.log(err)
        })

})

// after(function(done) {
//     clearProduct(done)
// })

describe('Product Test', function() {

    let _id = null

    let newProduct = {
        name: 'Lipstik',
        price: 500000,
        stock: 10,
    }

    describe('POST - Success', function() {

        describe('/products', function() {
            it('should send an object with status code 201', function(done) {
                chai
                    .request(app)
                    .post('/products')
                    .set('accesstoken', adminToken)
                    .send(newProduct)
                    .end(function(err, res) {
                        _id = res.body._id

                        expect(err).to.be.null
                        expect(res).to.have.status(201)
                        expect(res).to.be.an('Object')
                        expect(res.body).to.have.property('_id')
                        expect(res.body).to.have.property('name')
                        expect(res.body.name).to.equal(newProduct.name)
                        expect(res.body.price).to.equal(newProduct.price)
                        done()
                    })
            })
        })
    })

    describe('POST - Failed', function() {

        describe('/products - Field stock zero', function() {
            it('should send an error validation message with status code 403', function(done) {
                chai
                    .request(app)
                    .post('/products')
                    .set('accesstoken', adminToken)
                    .send({
                        name: 'Lipstik',
                        price: 500000,
                        stock: 0,
                        description: ''
                    })
                    .end(function(err, res) {
                        expect(err).to.be.null
                        expect(res).to.have.status(403)
                        expect(res).to.be.an('Object')
                        expect(res.body).to.have.property('message')
                        expect(res.body.message).to.equal('Product validation failed: stock: Invalid input')
                        done()
                    })
            })
        })
    
        describe('/products - Empty price', function() {
            it('should send an error validation message with status code 403', function(done) {
                chai
                    .request(app)
                    .post('/products')
                    .set('accesstoken', adminToken)
                    .send({
                        name: 'Uno',
                        price: '',
                        stock: 10,
                        description: 'Card game'
                    })
                    .end(function(err, res) {
                        expect(err).to.be.null
                        expect(res).to.have.status(403)
                        expect(res).to.be.an('Object')
                        expect(res.body).to.have.property('message')
                        expect(res.body.message).to.equal('Product validation failed: price: Product price required')
                        done()
                    })
            })
        })
    
    
        describe('/products - Empty name', function() {
            it('should send an error validation message with status code 403', function(done) {
                chai
                    .request(app)
                    .post('/products')
                    .set('accesstoken', adminToken)
                    .send({
                        name: '',
                        price: 50000,
                        stock: 10
                    })
                    .end(function(err, res) {
                        expect(err).to.be.null
                        expect(res).to.have.status(403)
                        expect(res).to.be.an('Object')
                        expect(res.body).to.have.property('message')
                        expect(res.body.message).to.equal('Product validation failed: name: Product name required')
                        done()
                    })
            })
        })
        
        describe('/products - Without access token', function() {
            it('should send an error validation message with status code 401', function(done) {
                chai
                    .request(app)
                    .post('/products')
                    .send(newProduct)
                    .end(function(err, res) {
                        expect(err).to.be.null
                        expect(res).to.have.status(401)
                        expect(res).to.be.an('Object')
                        expect(res.body).to.have.property('message')
                        expect(res.body.message).to.equal('Please login to continue')
                        done()
                    })
            })
        })

        describe('/products - Not admin', function() {
            it('should send an error validation message with status code 401', function(done) {
                chai
                    .request(app)
                    .post('/products')
                    .set('accesstoken', token)
                    .send(newProduct)
                    .end(function(err, res) {
                        expect(err).to.be.null
                        expect(res).to.have.status(403)
                        expect(res).to.be.an('Object')
                        expect(res.body).to.have.property('message')
                        expect(res.body.message).to.equal('Forbidden')
                        done()
                    })
            })
        })
    })

    describe('GET - Success', function() {
        describe('/products', function() {
            it('should send an array of objects with status code 200', function(done) {
                chai
                    .request(app)
                    .get('/products')
                    .set('accesstoken', token)
                    .end(function(err, res) {
                        expect(err).to.be.null
                        expect(res).to.have.status(200)
                        expect(res).to.be.an('Object')
                        expect(res.body[0]).to.have.property('_id')
                        expect(res.body[0]).to.have.property('name')
                        expect(res.body[0].name).to.equal(newProduct.name)
                        expect(res.body[0].price).to.equal(newProduct.price)
                        done()
                    })
            })
        })
    })

    describe('PATCH - Success', function() {
        describe('/products - Change the value', function() {
            it('should send an object with status code 200', function(done) {
                chai
                    .request(app)
                    .patch('/products' + `/${_id}`)
                    .set('accesstoken', adminToken)
                    .send({
                        stock: 12
                    })
                    .end(function(err, res) {
                        expect(err).to.be.null
                        expect(res).to.have.status(200)
                        expect(res).to.be.an('Object')
                        expect(res.body.n).to.equal(1)
                        expect(res.body.ok).to.equal(1)
                        expect(res.body.nModified).to.equal(1)
                        done()
                    })
            })
        })
    
        describe('/products - Without change the value', function() {
            it('should send an object with status code 200', function(done) {
                chai
                    .request(app)
                    .patch('/products' + `/${_id}`)
                    .set('accesstoken', adminToken)
                    .send({
                        stock: 12
                    })
                    .end(function(err, res) {
                        expect(err).to.be.null
                        expect(res).to.have.status(200)
                        expect(res).to.be.an('Object')
                        expect(res.body.n).to.equal(1)
                        expect(res.body.ok).to.equal(1)
                        expect(res.body.nModified).to.equal(0)
                        done()
                    })
            })
        })
    
    })

    describe('PATCH - Failed', function() {
        describe('/products - Without access token', function() {
            it('should send an object with status code 401', function(done) {
                chai
                    .request(app)
                    .patch('/products' + `/${_id}`)
                    .end(function(err, res) {
                        expect(err).to.be.null
                        expect(res).to.have.status(401)
                        expect(res).to.be.an('Object')
                        expect(res.body).to.have.property('message')
                        expect(res.body.message).to.equal('Please login to continue')
                        done()
                    })
            })
        })

        describe('/products - Not admin', function() {
            it('should send an error validation message with status code 401', function(done) {
                chai
                    .request(app)
                    .patch('/products' + `/${_id}`)
                    .set('accesstoken', token)
                    .send({
                        stock: 13
                    })
                    .end(function(err, res) {
                        expect(err).to.be.null
                        expect(res).to.have.status(403)
                        expect(res).to.be.an('Object')
                        expect(res.body).to.have.property('message')
                        expect(res.body.message).to.equal('Forbidden')
                        done()
                    })
            })
        })

        describe('/products - Id is not valid', function() {
            it('should send an object with status code 400', function(done) {
                const random_id = '1231456'
    
                chai
                    .request(app)
                    .patch('/products' + `/${random_id}`)
                    .set('accesstoken', adminToken)
                    .end(function(err, res) {
                        expect(err).to.be.null
                        expect(res).to.have.status(500)
                        expect(res).to.be.an('Object')
                        expect(res.body).to.have.property('message')
                        expect(res.body.message).to.equal(`Argument passed in must be a single String of 12 bytes or a string of 24 hex characters`)
                        done()
                    })
            })
        })
    })

    describe('DELETE - Success', function() {

        describe('/products', function() {
            it('should send an object with status code 200', function(done) {
                chai
                    .request(app)
                    .delete('/products' + `/${_id}`)
                    .set('accesstoken', adminToken)
                    .end(function(err, res) {
                        expect(err).to.be.null
                        expect(res).to.have.status(200)
                        expect(res).to.be.an('Object')
                        expect(res.body.n).to.equal(1)
                        expect(res.body.ok).to.equal(1)
                        expect(res.body.deletedCount).to.equal(1)
                        done()
                    })
            })
        })
    })

    describe('DELETE - Failed', function() {
        describe('/products - Without access token', function() {
            it('should send an object with status code 401', function(done) {
                chai
                    .request(app)
                    .delete('/products' + `/${_id}`)
                    .end(function(err, res) {
                        expect(err).to.be.null
                        expect(res).to.have.status(401)
                        expect(res).to.be.an('Object')
                        expect(res.body).to.have.property('message')
                        expect(res.body.message).to.equal('Please login to continue')
                        done()
                    })
            })
        })

        describe('/products - Not admin', function() {
            it.skip('should send an error validation message with status code 401', function(done) {
                chai
                    .request(app)
                    .delete('/products' + `/${_id}`)
                    .set('accesstoken', token)
                    .end(function(err, res) {
                        expect(err).to.be.null
                        expect(res).to.have.status(403)
                        expect(res).to.be.an('Object')
                        expect(res.body).to.have.property('message')
                        expect(res.body.message).to.equal('Forbidden')
                        done()
                    })
            })
        })

        describe('/products - Id is not valid', function() {
            it.skip('should send an object with status code 400', function(done) {
                const random_id = '1231456'
    
                chai
                    .request(app)
                    .delete('/products' + `/${random_id}`)
                    .set('accesstoken', adminToken)
                    .end(function(err, res) {
                        expect(err).to.be.null
                        expect(res).to.have.status(500)
                        expect(res).to.be.an('Object')
                        expect(res.body).to.have.property('message')
                        expect(res.body.message).to.equal(`Argument passed in must be a single String of 12 bytes or a string of 24 hex characters`)
                        done()
                    })
            })
        })
    })
})