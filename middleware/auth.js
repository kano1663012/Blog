const jwt = require('jsonwebtoken')
const collection = require('../db/conn')


const auth = async(req,res,next)=>{
   try {
       const token = req.cookies.jwt;
       const verifyUser = jwt.verify(token,process.env.secret_key);
       console.log(verifyUser);

       const user = await collection.findOne({_id:verifyUser._id})
       console.log(user);

       req.token = token;
       req.user = user;
       next(); 


   } catch (error) {
       res.status(400).send(error)
   }
}

module.exports = auth;