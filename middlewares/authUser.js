// Auth User MiddleWare
const {promisify} = require('util')
const jwt = require('jsonwebtoken');
const User = require('../models/userModel')
const authUser = async(req,res,next)=>{
    try {
         // Getting the token and check if it is there
    let token;
    if(req.headers.authorization &&  req.headers.authorization.startsWith('Bearer') ){
        token = req.headers.authorization.split(' ')[1];
    }
     console.log(token);

    if(!token){
        return res.status(401).json("errMsg: You are not logged in.Please First Logged in to get access")
    }

    // Verification of the token
      const decoded = await promisify(jwt.verify)(token,process.env.JWT_SECRET)
    console.log(decoded);
 
     // After the verification check if user still stick
    //This is another Important step.Now We have  To check Wheather that user still exist
    // Let suppose User login once and after that user deleted for any reason.If anyone have their token they can
    // reach us.So in order to Secure this this We have to check
    
    
    const freshUser = await User.findById(decoded.id)
    if(!freshUser){
         console.log(freshUser);
        return res.status(400).json({Error:"User  is deleted"})
    }
   


    // Check if user change Password after the JWT(Token) was Issued
   if(freshUser.changedPasswordAfter(decoded.iat)) {
   return res.status(401).json({Error:"You change Your password Recently.Please Login Again"})
   
   }
    
// Grant Access to the Protected Route
req.user = freshUser
next()     

} catch (error) {
    res.status(401).json({Error:error.message})
}

   
}



const roleRestrictor = (...roles)=>{
    return (req,res,next) =>{
        if(!roles.includes(req.user.role)){
            return res.status(400).json({Message:"You dont have access to perform this action"})
        }
        else{
            next()
        }

    }



}

module.exports = {authUser,roleRestrictor}