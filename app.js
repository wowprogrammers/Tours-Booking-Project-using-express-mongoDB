console.log('Welcome to the authentication autherization and security.Thank You');
const express = require('express');
const app = express();
const path = require('path')

app.set('view engine', 'pug');
app.set('views',path.join(__dirname, 'views'))


const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean')
// Importing the dotenv package
const dotenv = require('dotenv');
dotenv.config()  //Now dotenv  File configured Successfully
const port = process.env.PORT;
// Importing the DataBase Connection
require('./db/conn')
app.use(helmet())
// Serving the static Files
// app.use(express.static('./public'))
app.use(express.static(path.join(__dirname,'public')))
// Importing the json middleware
// Body parser,reading data from body into req.body
app.use(express.json({limit:'10kb'})) //From the req body we can not get the data more than 10kb

// Data Sanitization against NoSql Query Injection

app.use(mongoSanitize())    

// Data sanitization againt XSS Attack(Cross site scripting attack)

app.use(xss())

// Importing the express rate limit
const rateLimit = require('express-rate-limit')


// Limit request From the Same IP
const limiter = rateLimit({
max:30,
windowMs:60*60*1000,
message:"Too many Requests from this IP.You are bloked For an hour"    
})

app.use('/api',limiter)






/////////////////////////////// ROUTES
app.get('/',(req,res)=>{
    res.status(200).render('base')
})






// Importing the user Route
const userRouter = require('./routes/userRoute');
// Importing the auth route
const authRouter = require('./routes/authRoute')
// importing the tour route
const tourRouter = require('./routes/tourRoute');
// Importing the tour routes
const reviewRouter = require('./routes/reviewRoutes')
app.use('/',tourRouter)
// authRouter 
app.use('/',authRouter)
// userRouter
app.use('/api/v1/users',userRouter)
// reviewRouter
app.use('/api/v1/reviews',reviewRouter)



 




app.listen(port,()=>{
console.log(`Server is running... ON THE PORT ${port}`);

})