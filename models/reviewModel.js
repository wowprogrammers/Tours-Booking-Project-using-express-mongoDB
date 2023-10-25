const mongoose = require('mongoose');
const reviewSchema = mongoose.Schema({
review:{
    type:String,
    trim:true,
    required:true
},
rating:{

    type:Number,
    min:1.0,
    max:5.0
},
createdAt:{
    type:Date,
    default:Date.now()
},
RefToTour:{
    type:mongoose.Schema.ObjectId,
    ref: 'Tour',
    required:true
},
RefToUser:{
    type:mongoose.Schema.ObjectId,
    ref: 'User',
    required:true
}

},{//THis is optional part which we added to get the virtual properties(Whenever We try to acceess all the tour)

    toJSON:{virtuals:true},
    toObject:{virtuals:true},
    id:false


})

reviewSchema.pre(/^find/,function(next){
    // this.populate({
    //     path:"RefToTour",
    //     select:'name', As per Our Application requirment we dont want to populate tour when we want to access reviews
    // })
    this.populate({
        path:"RefToUser",
        select:'name photo'
    })
 

    next()
})

const Review = new mongoose.model('Review',reviewSchema);
module.exports = Review