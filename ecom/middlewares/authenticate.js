var User = require('../models/user');
var Cart = require('../models/cart');

module.exports = function (req, res, next) {
    if (req.session.userId) {
        User.findById(req.session.userId)
        .then(function (user) {
            res.locals.user = user; //locals are data we pass to hbs
            next();
        })
    } else {
        res.redirect('/login');
    }
}