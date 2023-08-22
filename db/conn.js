const mongoose = require('mongoose');
const url = process.env.url || "mongodb://127.0.0.1:27017/test"

mongoose.connect(url)
.then(()=>{
    console.log('db conneted');
}).catch((err)=>{
    console.log(err);
})
