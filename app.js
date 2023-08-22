require('dotenv').config()
const express  = require('express')
const app = express()
const path = require('path');
const ejs = require('ejs')
const bcrypt=require('bcryptjs')
require('./db/conn');
const jwt = require('jsonwebtoken')
const auth = require('./middleware/auth');
const cookieparser = require('cookie-parser')
const {collection,artical} = require('./models/Schema');
const { any } = require('webidl-conversions');
const port = process.env.port || 8080;


const template_path = path.join(__dirname ,'public')
// console.log(template_path)


app.use(express.json());
app.use(cookieparser());
app.set("view engine","ejs");
app.use(express.urlencoded({extended:false}))



app.get('/',(req,res)=>{
    res.render("signup")
})

app.get('/login', async(req,res)=>{
    try {
        // console.log('hiii');
        res.render("login")
    } catch (error) {
        console.log(error);
    }
})

app.post('/signup',async (req,res)=>{
    try {
        const ragister = new collection({
            name:req.body.name,
            email:req.body.email,
            password:req.body.password
        })
        console.log("the success part "+ ragister);
        const token =await ragister.genratetoken();
        console.log('the token part '+token);
        // console.log(ragister);

        res.cookie("jwt",token,{
            expires:new Date(Date.now()+50000),
            httpOnly:true 
        });

         const savedata = await ragister.save()
         console.log(savedata);
        res.status(201).redirect("/login")
} catch (error) {
        console.log(error);
        res.status(404).send(error)
    }
})
app.post('/login',async (req,res)=>{
    try {
        const email = req.body.email
        const password = req.body.password
        const check = await collection.findOne({email:email})
        const isMatch =await bcrypt.compare(password,check.password)

        // genrate tokens
        const token =await check.genratetoken();
        console.log('the token part '+token);

       
        // console.log(cookie);
        if(isMatch){
            res.cookie("jwt",token,{
                expires:new Date(Date.now()+50000),
                httpOnly:true 
            });
            res.redirect("/home")
        }
        else{
            res.send('Invalid login Details')
        }
    }catch(err){
        res.status(400).send(err);
    }
})

app.get('/home',async(req,res)=>{
    try {
        const data = await artical.find().sort({
            createdAt:'desc'
        })
        res.render('home',{data})
    } catch (error) {
        console.log(error);
    }
})

app.get('/new',async(req,res)=>{
    try {
        res.render('new')
    } catch (error) {
        console.log(error);
    }
})

app.post('/artical',async(req,res)=>{
    try {
        const data = new artical(req.body)
        console.log(data);
         const data1 = await data.save()
        res.redirect('/home')
    } catch (error) {
        console.log(error);
    }
})

app.get('/read/:id',async(req,res)=>{
    try {
        const data = await artical.findById(req.params.id)
            res.render('show',{data})
    } catch (error) {
        console.log(error);
    }
})

app.get('/edit/:id',async(req,res)=>{
    try {
        const data = await artical.findById(req.params.id,req.body)
        console.log(data);
        res.render('edit',{data})
    } catch (error) {
        console.log(error);
    }
})

app.post('/edit/:id',async(req,res)=>{
    try {
        const id = req.params.id
        const data = await artical.findByIdAndUpdate(id,req.body)
        res.redirect('/home')
    } catch (error) {
        console.log(err);
    }
})


app.get('/delete/:id',async(req,res)=>{
    try {
        const data = await artical.findByIdAndDelete(req.params.id)
        res.redirect('/home')
    } catch (error) {
        console.log(error);
    }
})







app.listen(port,()=>{
    console.log(`listening port ${port}`);
})