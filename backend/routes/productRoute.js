const express=require('express');
const {getallProducts ,createProducts ,updateProduct ,deleteProduct, getProductDetail, createProductReview, getSingleProductReview, deleteSingleProductReview, getAdminProducts}=require('../controllers/productController');
const { isAuthenticateUser,authorizedRole } = require('../middleware/auth');
const router=express.Router();

router.route('/products').get(getallProducts);
router.route('/admin/product/new').post(isAuthenticateUser,authorizedRole('admin'),createProducts);
router.route('/admin/product/:id').put(isAuthenticateUser,authorizedRole('admin'),updateProduct);
router.route('/admin/product/:id').delete(isAuthenticateUser,authorizedRole('admin'),deleteProduct);
router.route('/admin/products').get(isAuthenticateUser,authorizedRole('admin'),getAdminProducts);
router.route('/product/:id').get(getProductDetail);
router.route('/review').put(isAuthenticateUser,createProductReview);
router.route('/reviews').get(getSingleProductReview);
router.route('/reviews').delete(isAuthenticateUser,deleteSingleProductReview);

module.exports = router; 