var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var productSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        trim: true
    },
    image: {
        type: String,
        required: true
    },
    timesSold: {
        type: Number,
        default: 0
    },
    reviews: {
        type: Array,
        default: []
    }
}, {timestamps: true});

module.exports = mongoose.model('product', productSchema);