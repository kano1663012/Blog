const mongoose = require('mongoose');

mongoose.connect(process.env.url)
.then(()=>{
    console.log('db conneted');
}).catch((err)=>{
    console.log(err);
})
