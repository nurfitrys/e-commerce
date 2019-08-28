const User              = require('../models/user')
const { decrypt, sign } = require('../helpers')

class AuthController {
    static register(req, res, next) {
        User.create(req.body)
        .then(newUser => {
            res.status(201).json(newUser)
        })
        .catch(err => {
            if (err.message == 'Email has been taken') {
                next({
                    code : 400,
                    message: 'Email has been taken'
                })
            }
            else if (RegExp('validation').test(err.message)) {
                if (err.errors.email) {
                    next({
                        code : 400,
                        message : err.errors.email.message
                    })
                }
                else {
                    next({
                        code : 403,
                        message: err.message
                    })
                }
            }
            else {
                next(err)
            }
        })
    }

    static login(req, res, next) {
        User.findOne({
            email: req.body.email
        })
        .then(foundUser => {
            if (!foundUser) {
                next({
                    code : 404,
                    message: 'User is not found'
                })
            }
            else {
                if (decrypt(req.body.password, foundUser.password)) {
                    const token = sign(foundUser._id, foundUser.name, foundUser.role)
                    const payload = {
                        accesstoken: token
                    }
                    if (foundUser.role == 'Admin') {
                        payload.role = 'Admin'
                    }                    
                    res.status(200).json(payload)
                }
                else {
                    next({
                        code: 401,
                        message: `Wrong password`
                    })
                }
            }
        })
        .catch(next)
    }
}

module.exports = AuthController