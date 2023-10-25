const express = require('express');

const authRoute = express()

const authController = require('../controllers/authController');
const middlewares = require('../middlewares/authUser');
const userController = require('../controllers/userController')

authRoute.route('/signup').post(authController.signUp)
authRoute.route('/login').post(authController.login)
authRoute.route('/forgotPassword').post(authController.forgetPassword)
authRoute.route('/api/v1/users/resetPassword/:token').patch(authController.resetPassword)



authRoute.route('/api/v1/users/updateMyPassword').patch(middlewares.authUser,authController.updatePassword)
authRoute.route('/updateMe').patch(middlewares.authUser,userController.uploadUserPhoto,userController.updateMe);
authRoute.route('/deleteMyAccount').delete(middlewares.authUser,userController.deleteMe)
authRoute.route('/api/v1/users/me').get(middlewares.authUser,userController.getMe,userController.getUser)
authRoute.route('/api/v1/users/:id').get(middlewares.authUser,middlewares.roleRestrictor('admin'),userController.getUser)
authRoute.route('/api/v1/users/:id').get(middlewares.authUser,middlewares.roleRestrictor('admin'),userController.updateUser)

module.exports = authRoute