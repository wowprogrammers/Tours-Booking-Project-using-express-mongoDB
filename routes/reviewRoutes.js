const express = require('express');
const reviewRouter = express.Router({mergeParams:true});
const reviewController = require('../controllers/reviewController')

// We want only authenticated User can write the comment so thats why we are importing the Auth middleware

const authMiddle = require('../middlewares/authUser')

// POST /tours/26412542/reviews
// POST /reviews


// If we want to get all the reviews of specific tour
// Like this
// Get /tours/25431645/reviews
// Creating new review Route
reviewRouter.post('/',authMiddle.authUser,authMiddle.roleRestrictor('user'),reviewController.createReviews)
// Getting all reviews
reviewRouter.get('/',authMiddle.authUser,reviewController.allReview)
reviewRouter.delete('/:id',authMiddle.authUser,authMiddle.roleRestrictor('user','admin'),reviewController.deleteReview)
reviewRouter.get('/:id',authMiddle.authUser,reviewController.getReview) //Still test
reviewRouter.patch('/:id',authMiddle.authUser,authMiddle.roleRestrictor('user','admin'),reviewController.updateReview) //still test






module.exports = reviewRouter;