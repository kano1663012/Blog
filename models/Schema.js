const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');



const loginschema = mongoose.Schema({
    name:{
        type:String,
        require:true,
        unique:true
    },
    email:{
        type:String,
        require:true,
        unique:true
    },
    password:{
        type:String,
        require:true,
        unique:true
    },
    tokens:[{
        token:{
            type:String,
            require:true,
        }
    }]
})
//-------------genrate tokens--------------//
loginschema.methods.genratetoken = async function name() {
    try {
        const token = jwt.sign({_id:this._id.toString()},process.env.secret_key)
        this.tokens = this.tokens.concat({token:token})
        await this.save();
        return token;
    } catch (error) {
        // res.send("the error part "+error)
        console.log('the error part '+error);
    }
}

//-------------------convert password in to hash values----------------------------//
loginschema.pre("save",async function(next) {

    if(this.isModified("password")){
        // const bpass = await bcrypt.hash(password,10);
        console.log(`the current passwrod is ${this.password}`);
        this.password =await bcrypt.hash(this.password,10);
        // console.log(`the current passwrod is ${this.password}`);

    }
    next();
    
})

const collection = new mongoose.model("collection",loginschema)

//--------------articales Schema -----------------//

const articalSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    desc:{
        type:String
    },
    markdown:{
        type:String,
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

const artical = new mongoose.model('artical',articalSchema)

module.exports = {collection,artical};