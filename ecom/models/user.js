var mongoose = require('mongoose')
var bcrypt = require('bcryptjs');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    orders: {
        type: Array,
        default: []
    }
},
    { timestamps: true }
);

userSchema.pre('save', function (next) {
    var user = this;
    bcrypt.hash(user.password, 10)
    .then(function (hashedPassword) {
        user.password = hashedPassword;
        next();
    })
})

module.exports = mongoose.model('user', userSchema);