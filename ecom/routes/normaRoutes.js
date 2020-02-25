var express = require('express');
var router = express.Router();

var authenticate = require('../middlewares/authenticate');

var { renderHomepage, renderRegisterpage, renderLoginpage, renderProducts, renderProductDetail, renderCart, renderCheckout} 
= require('../controllers/normalControllers');

router.get('/', renderHomepage);
router.get('/register', renderRegisterpage);
router.get('/login', renderLoginpage);
router.get('/shoes/:category', renderProducts);
router.get('/shoes/:category/:shoeId', renderProductDetail);
router.get('/cart', authenticate, renderCart);
router.get('/checkout', authenticate, renderCheckout);

module.exports = router;