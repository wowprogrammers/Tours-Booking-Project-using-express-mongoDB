const User  = require('../models/userModel')
const handleFactory = require('../controllers/handleFactory')
const multer = require('multer')
// EveryThing About Multer
//cb stands for callback

// This is how We Specify the "destination" and "FILENAME" of our file
const multerStorage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'public/img/users')
    },
    filename:(req,file,cb)=>{
        const ext = file.mimetype.split('/')[1];
        cb(null,`user-${req.user.id}-${Date.now()}.${ext}`)

    }
})

// Allowing only Images Files   

const multerFilter = (req,file,cb)=>{

    if(file.mimetype.startsWith('image')){
        cb(null,true)
    }
    else{

            cb(null,false)
    }
}


const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter

});

const uploadUserPhoto = upload.single('photo');


// MULTER ENDED
const filterObj = (obj, ...allowedFields) =>{
    const newObj = {}
    Object.keys(obj).forEach(el =>{
        if(allowedFields.includes(el))
        newObj[el] = obj[el] 
    })

    return newObj


}


const getMe = (req,res,next)=>{

    req.params.id  = req.user.id;

    next()
}

const getUser = handleFactory.getOne(User)

// updating the user data (If user wants to update his/her data other than password)
const updateMe = async (req,res,next) =>{
// Create error if user posts password data

    if(req.body.password || req.body.confirmPassword){

        return res.status(400).json({Msg:"You can not update password In this route.Please Use /api/v1/users/updateMyPassword"})
    }
// Filtered Out unwanted fields that are not allowed to be updated
const filteredBody = filterObj(req.body,'name','email') //Lets define filterObj in top of the code
if(req.file) filteredBody.photo = req.file.filename
// Update User Document
const updatedUser = await User.findByIdAndUpdate(req.user.id,filteredBody,{
    new:true,
    runValidators:true

})

res.status(200).json({
    status:"Success",
    data:{
        user:updatedUser
    }
})

// Now We can not use the .save() method.Because in this case all the document is saved and all the validations will be checked
// As we are not working with the password related stuff.That is also another reason    
}


// If User Wants to Delete his/her account
const deleteMe = async (req,res,next) =>{
    await User.findByIdAndUpdate(req.user.id, {active:false})

    res.status(204).json({
        status:"Success",
        data:null
    })

}

const allUser = async(req,res)=>{

    const user = await User.find();
     res.status(200).json({
            status:"Success",
            Length:user.length,
            data:user
        })
}
const deleteUser = handleFactory.deleteOne(User)
const updateUser = handleFactory.updateOne(User)

module.exports = {allUser,updateMe,deleteMe,uploadUserPhoto,deleteUser,getMe,getUser,updateUser}