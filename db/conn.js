const mongoose = require('mongoose');
const uri = "mongodb://127.0.0.1:27017/test" || process.env.url
mongoose.connect(uri)
.then(()=>{
    console.log('db conneted');
}).catch((err)=>{
    console.log(err);
})
