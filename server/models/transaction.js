const mongoose = require('mongoose')
const { Schema } = mongoose

const TransactionSchema = new Schema({
    buyer: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    products: [{
        product: {
            type: Schema.Types.ObjectId,
            ref: 'Product'  
        },
        status: {
            type: String,
            enum: [ 'Pending', 'Transit', 'Delivered' ],
            default: 'Pending'
        },
    }],
    total_price: {
        type: Number,
        min: [ 0, 'Invalid input' ]
    }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
})

const Transaction = mongoose.model('Transaction', TransactionSchema)

module.exports = Transaction