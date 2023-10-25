// In this controller  We will do most of the user related Stuff like creating new User,logging user in,Updating Password
//  in the authentication controller

const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
// Importing the email utility
const sendEmail = require('../utils/email')
// Importing the crypto module
const crypto = require('crypto')
// Here We are creating the token Function

const signToken = id =>{


   return jwt.sign({id}, process.env.JWT_SECRET , {expiresIn:process.env.JWT_EXPIRESIN})


}

const createSendToken =  (user,statusCode,res)  => {
    const token = signToken(user._id);

        // Creating the Cookie
         res.cookie('jwt', token , { //jwt is the name of cookie
            expires: Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000 ,
        // secure:true,   //Cookie will only be sent on an encrypted connection .So basically we are only using Https 
        // We will activate this part when we are in production 
        
        
        httpOnly:true //Cookie can not be accessed or modified in any way by the browser(Prevent Cross site Scripting attacks)
        // Browser just recieve the cookie ,store it and then send it automatically along with every project

        });
        // We send the cookie through res.cookie
            user.password = undefined
    res.status(statusCode).json({
        status:"Success",
        token,
        data:{
            user
        }
    })
}
const signUp = async(req,res)=>{
try {

    // const newUser = await User.create(req.body); We have to replace this field  with this one
    // Because we want the specific data from the body

    const newUser = await User.create({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        role:req.body.role,
        confirmPassword:req.body.confirmPassword,
        passwordChangedAt:req.body.passwordChangedAt
        
    })  

    createSendToken(newUser,201,res);

    // Now With the help of function we are just doing this whole task
    //     const token = signToken(newUser._id)
    // res.status(201).json({
    
    //     status:'Success',
    //     token,
    //     data:{
    //         user:newUser
    //     }
    // })
    
    
} catch (error) {
    res.status(400).json({Error:error.message})
}

}

const login = async(req,res,next)=>{
    try {
        // const email = req.body.email;
        const {email,password} = req.body

        // Check if email and password exist
        if(!email || !password){

          return  res.status(400).json({msg:"Password or Email is Missing.Please Enter the missing field first"})
        }

        // Check if user exist and password is correct
      const user = await User.findOne({email}).select('+password');//Here we Explicitly Want the password field
    //   console.log(user) 
        
        if(!user || !await user.correctPassword(password,user.password) ){
            return res.status(401).json({msg:"Incorrect Password or Email..."})
        }

        // If everything is OK,Send token to the client 

         createSendToken(user,200,res);
//        const token = signToken(user._id); 

//        res.status(200).json({
//        status:"Success",
//        token:token

// })


       } catch (error) {
        res.status(400).json({error:error.message})
    }
}



const forgetPassword = async(req,res,next)=>{

    try {

        // Get user Based on posted Email
        const {email} = req.body
        const user = await User.findOne({email})

        if(!user){
            return res.status(404).json({Msg:"User With This email Doesnt exist"})
        }
       //  generate the random reset token number

        const resetToken = user.createPasswordResetToken()
        await user.save({validateBeforeSave:false})
        // For Testing purpose We are sending response
        // res.status(200).json({Msg:"Email Sends Successfully"})
       // Send it to the user's Email

        const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`
        const message =   `Forgot Your Password? Submit a PATCH request with your new password and passwordConfirm to: ${resetUrl}.\n. If you didn't forget
        your password, please ignore this email `
try {
    await sendEmail({
        email:user.email,
        subject:"YOUR PASSWORD RESET TOKEN (VALID FOR  10 MINUTES)",
        message
    })
     res.status(200).json({status:"Success",message:"Token Sent Successfully to your Email"})
} catch (error) {
    user.passwordResetToken = undefined,
    user.passwordResetExpires = undefined,
    await user.save({validateBeforeSave:false})
    res.status(500).json({Error:error.message})
}
       
    } catch (error) {
        res.status(400).json({Error:error.message})
    }


}
const resetPassword = async (req,res,next)=>{
try {
    
    // Get User Based On the token
    const hashedToken  = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
        // During the password forget time We set this to the user

        passwordResetToken:hashedToken,
        passwordResetExpires:{ $gt:Date.now() }
    })
    // If token Has Not expired ,And There is a User ,Set The new Password

        if(!user){
            return res.status(400).json("Token is Invalid or Has Expired")

        }
        user.password = req.body.password;
        user.confirmPassword = req.body.confirmPassword;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined
        await user.save()
    // Update changedPasswordAt Property For the User
    //  This functionality we done in the "user model"

    // Log In the User In,Send The JWT
    createSendToken(user,201,res);



} catch (error) {
    res.status(400).json({Error:error.message})
}
    
}
 
const updatePassword = async (req,res,next)=> {

    try {
        // Get user From the collection
// We are getting the user ID from the authenticated Middleware.Because Only authenticated user can update his password
// Secondly We want the password property now explicitly.As by Default we set to false
const user = await User.findById(req.user.id).select('+password');
const {currentPassword} = req.body;
// Check If posted Currect Password is correct
 
if(!user || !await user.correctPassword(currentPassword,user.password) ){
    return res.status(401).json({msg:"Incorrect Password or Invalid User..."})
}
// Second Way of comparing the passsword
//  const resultPassword = await bcrypt.compare(currentPassword,user.password) // For this We have to include the bcryptjs module 

// If so Update the password
user.password = req.body.password; //req.body.Variable(name property of this field)
user.confirmPassword = req.body.confirmPassword  //req.body.Variable(name property of this field)
await user.save();

// await User.findByIdAndUpdate we did not use this method intentionally


// There are two reasons of this we already studied
// 1: Validtor (password and confirm password ) did not work .
// 2: Two middleware also not work (encryption of password) && passwordChangedAt middleware
 

// Log User In,send Jwt
createSendToken(user,200,res);

    } catch (error) {
        res.status(400).json({Error:error.message})
    }

}

module.exports = {signUp,login,forgetPassword,resetPassword,updatePassword}