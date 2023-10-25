const Tour = require('../models/tourmodel')
const APIFeatures = require('../utils/APIFeatures')
const handleFactory = require('../controllers/handleFactory')
const createTour = async(req,res)=>{
try {        
    const {name,duration,maxGroupSize,difficulty,ratingsAverage,ratingsQuantity,price,summary,description,imageCover,images,startDates,secretTour,guides} = req.body;
    const newTour = await Tour.create({
        name,
        duration,
        maxGroupSize,
        difficulty,
        ratingsAverage,
        ratingsQuantity,
        price,
        summary,
        description,
        imageCover,
        images,
        startDates,
        secretTour,
        guides
    })
    res.status(200).json({
        status:"Success",
        data:newTour
    })
    
} catch (error) {
    res.status(400).json({
        status:"Fail",
        message:error.message
    })
}
}

const aliasTopTours = (req,res,next)=>{
req.query.limit = '5';
req.query.sort = '-ratingsAverage,price';
req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
next()
}




const getAllTour = async(req,res)=>{
    try {  
                const features = new APIFeatures(Tour.find(),req.query).filter().sort().fieldLimits().paginate()

                    //Execuating Query
        const tours = await features.query;
        
        res.status(200).json({
            status:"Success",
            Length:tours.length,
            data:
            {
                data:tours
            }

            
        })

    } catch (error) {
        res.status(400).json({Error:error.message})
        
    }

}

// const getTour = async(req,res)=>{
//     try {
//         const tour = await Tour.findById(req.params.id)
//         .populate({
//             path:'reviews'
//         })
//         res.status(200).json({
//             status:"Success",
//             data:tour
//         })
//     } catch (error) {
//         res.status(400).json({Error:error.message})
        
//     }

// }
const getTour = handleFactory.getOne(Tour,'reviews')
const deleteTour = handleFactory.deleteOne(Tour)


const updateTour = handleFactory.updateOne(Tour)



const getTourStats = async(req,res)=>{
try {
    const stats = await Tour.aggregate([
        {
            $match:{duration : {$gte: 4.5}}

        },
        {
            $group:{
                _id:"$difficulty",
                numTours:{$sum:1},
                numRatings:{$sum:'$ratingsQuantity'},
                avgRatings:{$avg:'$ratingsAverage'},
                avgPrice:{$avg:"$price"},
                minPrice:{$min:'$price'},
                maxPrice:{$max:'$price'},
            }

        },
        // {
        //     $match:{minPrice:{$lte:397}}
        // }

    ])
    res.status(200).json({
        status:"Success",
        stats:stats
    })


} catch (error) {
    res.status(400).json({Error:error.message})
}
}

const monthlyPlan = async(req,res)=>{

    const year = req.params.year * 1;
    const plan = await Tour.aggregate([
        {

            $unwind : '$startDates'

        },
        {

            $match :{ startDates:{$gte: new Date(`${year}-01-01`),
                        $lte:new Date(`${year}-12-31`)
        }}
        },
        {
            $group:{
                _id:{$month:'$startDates'},
                numOfTours:{$sum:1},
                tours:{$push:'$name'}
            }
        },
        {

            $addFields:{month:'$_id'}
        },
        {
            $project:{
                _id:0
            }
        }
    ])

    res.status(200).json({
        status:"Success",
        MonthlyPlan:plan
    })


}


module.exports ={createTour,getAllTour,getTour,updateTour,deleteTour,aliasTopTours,getTourStats,monthlyPlan}