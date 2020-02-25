var bcrypt = require('bcryptjs');
var User = require('../models/user');
var Cart = require('../models/cart');
var Product = require('../models/product');
var Order = require('../models/order');

var apiController = {};

apiController.registerUser = function (req, res) {
    var user = new User(req.body);
    user.save()
        .then(function (user) {
            var cart = new Cart({ userId: user._id, products: [] });
            cart.save()
                .then(function (cart) {
                    return res.redirect('/login');
                });
        })
        .catch(function (err) {
            res.redirect('/register');
        })
}

apiController.loginUser = function (req, res) {
    var email = req.body.email;
    var pwd = req.body.password;
    //var backURL = req.header('Referer') || '/shoes/Men?page=1';
    User.findOne({ email: email })
        .then(function (user) {
            bcrypt.compare(pwd, user.password)
                .then(function (result) {
                    if (result) {
                        req.session.userId = user._id;
                        return res.redirect('/shoes/Men?page=1');
                    };
                    res.redirect('/login');
                })
        })
        .catch(function (err) {
            console.log(err)
            res.redirect('/login');
        })
}

apiController.addReview = function (req, res) {
    var productId = req.params.productId;
    var category = req.query.category;
    var review = req.body;
    Product.updateOne({ _id: productId }, { $push: { reviews: review } })
        .then(function (result) {
            res.redirect(`/shoes/${category}/${productId}`);
        })
}

apiController.addToCart = function (req, res) {
    var productId = req.params.productId;
    var category = req.query.category;
    var from = req.query.from;
    var userId = req.session.userId;
    Cart.findOneAndUpdate({userId},{$push: {products: {productId, quantity: 1}}})
    .then(function (result) {
        if (result){
            if (from == "buyNow"){
                return res.redirect('/cart');
            }
            return res.redirect(`/shoes/${category}/${productId}`);
        }
        res.redirect(`/shoes/${category}/${productId}`);
    })
}

apiController.quantityIncrement = function (req,res) {
    var productId = req.params.id;
    var userId = req.session.userId;
    Cart.findOneAndUpdate({userId,"products.productId":productId}, {$inc: {"products.$.quantity": 1}})
    .then(function (cart) {
        res.redirect('/cart');
    })
}

apiController.quantityDecrement = function (req,res) {
    var productId = req.params.id;
    var userId = req.session.userId;
    Cart.findOneAndUpdate({userId,"products.productId":productId}, {$inc: {"products.$.quantity": -1}})
    .then(function (cart) {
        res.redirect('/cart');
    })
}

apiController.checkOut = function (req,res) {
    Cart.findOne({userId : req.session.userId})
    .then(function (cart) {
        var cart = JSON.parse(JSON.stringify(cart));
        var order = new Order({
            userId : cart.userId,
            orderDetails : cart.products
        })
        return order.save()
    })
    .then(function (order) {
        if (order){
            return Cart.findOneAndUpdate({userId : req.session.userId},{$set: {products: []}})
        }
        res.redirect('/cart');
    })
    .then(function (result) {
        if (result) return res.redirect('/checkout');
        res.redirect('/cart');
    })
}

apiController.logoutUser = function (req, res) {
    req.session.destroy();
    res.redirect('/');
}

module.exports = apiController;