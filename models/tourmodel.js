const mongoose = require('mongoose')
const slugify = require('slugify')
const tourSchema = new mongoose.Schema({
 
name:{
    type:String,
    required:[true,"Please Enter the name of tour"],
    unique:true,
    trim:true
},
slug:String,
duration:{
    type:Number,
    required:[true,"A tour must have the duration"]
},
maxGroupSize:{
    type:Number,
    required:[true,"A tour Must have Max Group size"]
},
difficulty:{
    type:String,
    required:[true,"Must have difficulty"],
    enum:{ //only for strings
        values:["easy","medium","difficult"],
        message:"Difficulty can be either easy,medium or difficult"

    }
},
ratingsAverage:{
    type:Number,
    default:4.5,
    min:[1.0,"Ratings average minimum can be 1.0"],
    max:[5.0,"Ratings can max  be 5.0"]
},
ratingsQuantity:{
    type:Number,
    default:0
},
price:{
    type:Number,
    required:[true,"A tour Must have Some Price"]
},
priceDiscount:Number,
summary:{
    type:String,
    trim:true
},
description:{
    type:String,
    trim:true
},
imageCover:{
    type:String,
    requried:[true,'A tour Must have cover image']
},
images:[String],
createdAt:{
    type:Date,
    default:Date.now()
},
secretTour:{
    type:Boolean,
    default:false
},
startLocation:{
// Mongodb use special data formate to represent geospatial data called GeoJSON 
// GeoJSON
type:{
type:String,
default:'Point',
enum:['Point']
},
coordinates:[Number],//Coordinate lonigtue first and second latitude Usually opposite to the normal sequence (this is how in GeoJSon work),
address:String,
description:String
},
locations:[
{
    type:{
        type:String,
        default:'Point',
        enum:['Point']

    },
    coordinates:[Number],
    address:String,
    description:String,
    day:Number
}
],
guides:[{   //This is child referencing .Here we are refering the user by using the id

type: mongoose.Schema.ObjectId,
ref: 'User',

}],



startDates:[Date]
},{//THis is optional part which we added to get the virtual properties(Whenever We try to acceess all the tour)

    toJSON:{virtuals:true},
    toObject:{virtuals:true},
    id:false


})


tourSchema.index({price:1})


tourSchema.virtual('durationWeeks').get(function(){
    if(this.duration) return this.duration/7; //We put this condition bcoz we want to show this field only when user wants to see the 'duration' field
})
// Document Middleware execuate for only save() and create()method of mongoose
tourSchema.pre('save',function(next){
this.slug = slugify(this.name ,{lower:true})  //this represent the currently being saved document
next()

})
// On the other side post middleware execuate when all the pre middleware complete their execuation.This middleware doesnot have this keyword
// But have the complete(finished) doc
// tourSchema.post('save',function(doc,next){
// console.log(doc)
// })


// Query Middleware

tourSchema.pre(/^find/,function(next){
    this.find({secretTour:{$ne:true}})
    next()
})

// Populating the guide(It means Users Data)
tourSchema.pre(/^find/,function(next){
this.populate({
    path:"guides",
    select:'-__v -passwordChangedAt',
    
})

next()
})

// virtual populate to populate reviews when we want to access the specific tour
tourSchema.virtual('reviews',{
    ref:'Review',
    foreignField:'RefToTour',
    localField:'_id'
})

// Aggregation Middleware
tourSchema.pre('aggregate',function(next){
    this.pipeline().unshift({$match :{secretTour:{$ne:true}}}) //This is because we want to exclude the secret tour on aggregation too
    // console.log(this.pipeline);
    next()
})
const Tour = mongoose.model('Tour',tourSchema)
module.exports = Tour