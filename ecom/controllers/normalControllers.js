var mongoose = require('mongoose');
var Product = require('../models/product');
var Cart = require('../models/cart');

var normalController = {};

normalController.renderHomepage = function (req,res) {
    res.render('home');
}

normalController.renderRegisterpage = function (req,res) {
    res.render('register');
}

normalController.renderLoginpage = function (req,res) {
    res.render('login');
}

normalController.renderProducts = function (req,res) {
    var category = req.params.category;
    var page = parseInt(req.query.page);
    var skip = (page-1)*8;
    var prevDis,nextDis;
    var totalPages = 3; //based on db - totalpages = totalproductsinthatcateg/8
    if (page == 1) prevDis ="disabled";
    if (page == totalPages) nextDis ="disabled";
    // var pages = [1,2,3]
    Product.find({category},{name:true,category:true,price:true,image:true},{skip:skip,limit: 8})
    .then(function (products) {
        res.render('products.hbs', 
        {products,category,prevPage: page-1,nextPage: page+1,prevDis,nextDis,totalPages,page});
    })
}

normalController.renderProductDetail = function (req,res) {
    var category = req.params.category;
    var shoeId = req.params.shoeId;
    var outProduct;
    Product.findOne({_id: shoeId})
    .then(function (product) {
        outProduct = product;
        return Product.find({category},{},{limit: 5}).sort({timesSold : 1})
    })
    .then(function (recommended) {
        res.render('productDetail', {product: outProduct, recommended});
    })
}

normalController.renderCart = function (req,res) {
    var userId = req.session.userId;
    Cart.findOne({userId}).populate({path :'products.productId',model : 'product'}).exec()
    // useri, products [{pId,quan}]
    //userid, prodcts [{{name,price,image},quan}]
    .then(function (cart) {
        var products = [];
        var cartTotal = 0;
        var cartCopy = JSON.parse(JSON.stringify(cart));
        if (cartCopy.products.length){
            cartCopy.products.forEach(prod => {
                var product = {
                    id: prod.productId._id,
                    name: prod.productId.name,
                    price: prod.productId.price,
                    image: prod.productId.image,
                    quantity: prod.quantity, 
                }
                product.totalPrice = product.quantity*product.price;
                products.push(product);
                cartTotal = products.reduce(function (accum,current) {
                    var totalPrice = accum.totalPrice+current.totalPrice
                    return {totalPrice:totalPrice};
                })
                cartTotal = cartTotal.totalPrice;
            });
        }
        var noOfCartItems = products.length;
        res.render('cart', {products,cartTotal,noOfCartItems});
    })
}

normalController.renderCheckout = function (req,res) {
    res.render('checkout');
}

module.exports = normalController;