const express = require('express');
const userRoute = express();
// Importing the user Router
const userController = require('../controllers/userController')
// Importing the auth user middleware
const middlewares = require('../middlewares/authUser')


// userRoute.delete('/:id',middlewares.authUser,middlewares.roleRestrictor('admin'),method_to_run)
userRoute.delete('/:id',middlewares.authUser,middlewares.roleRestrictor('admin'),userController.deleteUser)

userRoute.get('/',middlewares.authUser,userController.allUser)

module.exports = userRoute