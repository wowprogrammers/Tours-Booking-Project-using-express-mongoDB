const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/Jonas',{

useCreateIndex:true,
useUnifiedTopology:true,
useNewUrlParser:true,
useFindAndModify:false
}).then((conn)=>{
    // console.log(conn.connections);
    console.log('Data Base Connected Successfully');
}).catch((err)=>{
    console.log('Not Connected');
})