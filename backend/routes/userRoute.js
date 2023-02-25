const express=require('express');
const { registerUser, loginUser, logout, forgotPassword, resetPassword, getUserDetails, updatePassword, updateProfile, getAllUsers, getSingleUserDetail, updateUserProfile, deleteUser } = require('../controllers/userController');
const { isAuthenticateUser,authorizedRole } = require('../middleware/auth');
const router=express.Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/forgot/password').post(forgotPassword);
router.route('/reset/password/:token').put(resetPassword);
router.route('/logout').get(logout);
router.route('/profile').get(isAuthenticateUser,getUserDetails);
router.route('/update/password').put(isAuthenticateUser,updatePassword)
router.route('/update/profile').put(isAuthenticateUser,updateProfile)
router.route('/admin/users').get(isAuthenticateUser,authorizedRole('admin'),getAllUsers);
router.route('/admin/user/:id').get(isAuthenticateUser,authorizedRole('admin'),getSingleUserDetail);
router.route('/admin/user/:id').put(isAuthenticateUser,authorizedRole('admin'),updateUserProfile);
router.route('/admin/user/:id').delete(isAuthenticateUser,authorizedRole('admin'),deleteUser);
module.exports=router;