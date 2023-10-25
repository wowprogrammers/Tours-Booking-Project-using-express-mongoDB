const Review = require('../models/reviewModel')
const handleFactory = require('../controllers/handleFactory')


const createReviews = async(req,res)=>{
try {
    if(!req.body.RefToTour)  req.body.RefToTour = req.params.tourId;
    if(!req.body.RefToUser)  req.body.RefToUser = req.user.id;


    const review = req.body.review;
    const rating = req.body.rating;
    const RefToTour = req.body.RefToTour;
    const RefToUser = req.body.RefToUser;
    const createdAt = req.body.createdAt

        // const {review,rating,createdAt,RefToTour,RefToUser} = req.body;
        const reviewData = new Review({
            review,
            rating,
            createdAt,
            RefToTour,
            RefToUser
        })
        const savedReview = await reviewData.save();
        res.send(savedReview)


} catch (error) {
    res.status(400).json({Error:error.message})
}
}

const allReview = async(req,res)=>{
try {
    let filter = {};
    if(req.params.tourId) filter = {RefToTour:req.params.tourId}
    const allReview = await Review.find(filter);
    res.status(200).json({
        status:"success",
        length:allReview.length,
        Reviews:allReview
    })
    
} catch (error) {
        res.status(400).json({Error:error.message})
}


}

const deleteReview = handleFactory.deleteOne(Review) 
const getReview = handleFactory.getOne(Review)
const updateReview = handleFactory.updateOne(Review)


module.exports = {createReviews,allReview,deleteReview,getReview,updateReview}