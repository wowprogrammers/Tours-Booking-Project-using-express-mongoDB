const express = require('express');
const tourRoute = express();
const tourController = require('../controllers/tourController')
const authMiddle = require('../middlewares/authUser')
const reviewRouter = require('../routes/reviewRoutes')
// Creating New Tour
tourRoute.post('/api/v1/tours',authMiddle.authUser,authMiddle.roleRestrictor('admin','lead-guide'),tourController.createTour)
// Getting All Tours
tourRoute.get('/api/v1/tours',tourController.getAllTour)
// Updating Tour
tourRoute.patch('/api/v1/tours/:id',authMiddle.authUser,authMiddle.roleRestrictor('admin','lead-guide'),tourController.updateTour)
// Now we want to create a route which is used my users most oftenly
tourRoute.get('/top-5-cheap',tourController.aliasTopTours,tourController.getAllTour)
// Get some Stats of the tour
tourRoute.get('/tour-stats',tourController.getTourStats)
// Geting the monthly plan
tourRoute.get('/monthly-plan/:year',authMiddle.authUser,authMiddle.roleRestrictor('admin','lead-guide','guide'),tourController.monthlyPlan)

// tourRoute.post('/api/v1/tours/:tourId/reviews',authMiddle.authUser,authMiddle.roleRestrictor('user'),reviewController.createReviews)

// Or We can do like this upper functionlity
// This is middleware
tourRoute.use('/api/v1/tours/:tourId/reviews',reviewRouter)

// Deleting The Tour
tourRoute.delete('/api/v1/tours/:id',authMiddle.authUser,authMiddle.roleRestrictor('admin','lead-guide','guide'),tourController.deleteTour)

// Getting Specific tour Base On id
tourRoute.get('/api/v1/tours/:id',tourController.getTour)


module.exports = tourRoute