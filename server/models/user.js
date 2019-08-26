const mongoose   = require('mongoose')
const { Schema } = mongoose
const { encrypt } = require('../helpers')

const UserSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        validate: [
            {
                validator: v => /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/.test(v),
                message: 'Email is not valid email address'
            }
        ]
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    cart: [{
        type: Schema.Types.ObjectId,
        ref: 'Product'
    }],
    role: {
        type: String,
        default: 'Customer'
    }
})


UserSchema.post('save', function (error, doc, next) {
    if (error.name == 'MongoError' && error.code === 11000) {
        next(new Error('Email has been taken'))
    } else {
        next()
    }
})

UserSchema.pre('save', function (next) {
    this.password = encrypt(this.password)
    next()
})

const User = mongoose.model('User', UserSchema)

module.exports = User
