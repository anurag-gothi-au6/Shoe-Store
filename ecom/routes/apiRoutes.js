var express = require('express');
var router = express.Router();
var authenticate = require('../middlewares/authenticate');

var { registerUser, loginUser, addReview, addToCart, logoutUser, quantityIncrement, quantityDecrement, checkOut }
    = require('../controllers/apiControllers');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/addReview/:productId', addReview);
router.post('/addToCart/:productId', authenticate, addToCart);
router.post('/quantityIncrement/:id', authenticate, quantityIncrement);
router.post('/quantityDecrement/:id', authenticate, quantityDecrement);
router.post('/checkout', authenticate, checkOut);
router.delete('/logout', authenticate, logoutUser);

module.exports = router;