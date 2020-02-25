var express = require('express');
var session = require('express-session');
var path = require('path');
var hbs = require('hbs');
var methodOverride = require('method-override');
var app = express();

var normalRoutes = require('./routes/normaRoutes');
var apiRoutes = require('./routes/apiRoutes');
var Cart = require('./models/cart');

require('./db');
require('./utils/hbsHelpers');

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views", "pages"));
app.set("view options", { layout: "../layouts/default" });
hbs.registerPartials(path.join(__dirname, "views", "partials"));

app.use(express.static('public'));
app.use(methodOverride('_method'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
    session({
        secret: "random1234",
        resave: false,
        name: "appSession",
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 30,
            httpOnly: true,
            secure: false,
            sameSite: "strict"
        }
    })
);

app.use(function (req,res,next) {
    res.locals.user = req.session.userId;
    if (req.session.userId){
        Cart.findOne({userId: req.session.userId}).populate({path:'userId',model:'user'}).exec()
            .then(function (cart) {
                res.locals.noOfCartItems = cart.products.length;
                res.locals.userName = cart.userId.name;
                next();
                //res.locals = res.render('hbs', {locals object})
            })
    } else {
        next();
    }
});

app.use(normalRoutes);
app.use(apiRoutes);

app.listen(3000);