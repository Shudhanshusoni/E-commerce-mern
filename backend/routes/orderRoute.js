const express=require('express');
const { newOrder, getSingleOrder, myOrders, getAllOrders, updateOrder, deleteOrder } = require('../controllers/orderController');
const { isAuthenticateUser,authorizedRole } = require('../middleware/auth');
const router=express.Router();

router.route('/order/new').post(isAuthenticateUser,newOrder);
router.route('/order/:id').get(isAuthenticateUser,getSingleOrder);
router.route('/orders/my').get(isAuthenticateUser,myOrders);
router.route('/admin/orders').get(isAuthenticateUser,authorizedRole('admin'),getAllOrders);
router.route('/admin/orders/:id').put(isAuthenticateUser,authorizedRole('admin'),updateOrder);
router.route('/admin/orders/:id').delete(isAuthenticateUser,authorizedRole('admin'),deleteOrder);
module.exports=router;