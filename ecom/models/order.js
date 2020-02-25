var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var orderSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    orderDetails: {
        type: [{productId : {type: Schema.Types.ObjectId,ref: 'product'}, quantity : {type: Number}}],
        required: true
    } // address
}, {timestamps: true});

module.exports = mongoose.model('order', orderSchema);