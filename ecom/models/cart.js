var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var cartSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    products: {
        type: [{productId : {type: Schema.Types.ObjectId,ref: 'product'}, quantity : {type: Number}}],
        required: true
    },
    orderTotal: {
        type: Number,
        required: true
    }
}, {timestamps: true});

// cartSchema.virtual('productId').get(function () {
//     return this.products.productId;
// })
module.exports = mongoose.model('cart', cartSchema);