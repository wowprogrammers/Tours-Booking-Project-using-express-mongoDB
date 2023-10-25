const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto') //For this we dont need to install any package manually

const userSchema = new mongoose.Schema({

name:{
    type:String,
    required:[true,'Please Tell Us Your Name'],
    trim:true
},
email:{
    type:String,
    required:[true,"Please Provide Your email"],
    unique:true,
    lowercase:true
},
password:{
    type:String,
    required:[true,"Please Provide a password"],
    minlength:8,
    select:false //We Did this to When we dont want to select this field.When We are getting All the users.
},
confirmPassword:{
    required:[true,"Please Provide confirm a password"],
    type:String,
    validate:{   //This only work when we create the new user.(Not valid when we update the password(see later))
        validator:function(value){
            // console.log("1234567890" === "1234567890")
            return value === this.password
            // 
            // Very Very ImportantPoint We Can not use arrow function here because arrow does not have its 'this'
            // Keyword 
            // 
            
        },
        message:"Please Enter the Same Password"
    }   
},

photo:{
    type:String,
    default:"default.jpg"
    // required:[true,"Please Upload Your Image First"]
},
passwordChangedAt:Date,
passwordResetToken:{
    type:String
},
passwordResetExpires:Date,
active:{
    type:Boolean,
    default:true,
    select:false
},
role:{

    type:String,
    enum:['user','guide','lead-guide','admin'],
    default:'user'
}

});

// Now we want to bcrypt the password as we want to store the pasword in hash form
// Keep this thing in your mind It is better to hashing here instead of IN controller

// but a pre-save hook is middleware that is executed when a document is saved.
userSchema.pre('save',async function(next){
// Only run this function if password was actually modified
if(!this.isModified('password')) return next();
// And if Password Field is modified than run the below code
this.password = await bcrypt.hash(this.password,12);
this.confirmPassword = undefined;
next()
})
//  a pre-save hook is middleware that is executed when a document is saved.(Also Called document Middleware save() and Create())
userSchema.pre('save',async function(next){
    if(!this.isModified('password') || this.isNew ) return next();
        // this.isNew Property We use It means IF the new Document is created At that time We dont want to work on passwordChangedAt property

        // Hm srf Ya chahaty hai jb actually password change kiyaa jie sirf usi time hm ya property set krey
    this.passwordChangedAt = Date.now() - 1000;
    next();
})

// This is here we are specifying when we are finding all the users.We will get the users only have active property set to true

userSchema.pre(/^find/ , function(next){

    this.find({active:{ $ne: false}});
    next()

})

// This method(CorrectPassword) I used in authController
userSchema.methods.correctPassword = async function(typedPassword,userPassword){

    return await bcrypt.compare(typedPassword,userPassword)

}
// This method I used in The "authUser MiddleWare"

userSchema.methods.changedPasswordAfter = function(JWTTimestamp){
    if(this.passwordChangedAt){
        const changedTimeStamp = parseInt(this.passwordChangedAt.getTime()/1000,10);
        // console.log(changedTimeStamp,JWTTimestamp)
        return JWTTimestamp < changedTimeStamp

        // Hm na sirf ya daikhna ka token issue hny k baaad Password change kiya hai us na.
        // 100<200(It means "password change" aftet the token issue) True
        // 300<200 (It is false It means password is "not changed")
    }

    // False Means Not changed Password
    return false
}

// This method I used in authController

// Reset Password Token

userSchema.methods.createPasswordResetToken = function(){
    const resetToken = crypto.randomBytes(32).toString('hex');
    // We are Storing reset token in encrypted form
   this.passwordResetToken =  crypto.createHash('sha256').update(resetToken).digest('hex');
    // After 10 minutes this reset token will expire
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    console.log({resetToken}, {encrypted_Form: this.passwordResetToken});
    return resetToken
}

const User = mongoose.model('User',userSchema);
module.exports = User