    const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const session = require('express-session');
const {v4:uuidv4} = require('uuid');
const collection = require('./config');

const app = express();
//CONVERT DATA IN TO JSON
app.use(express.json());
app.use(express.urlencoded({extended:true}));
//SET SESSION PART
app.use(session({
    secret:uuidv4(),
    resave:false,
    saveUninitialized:true

}));
//USE EJS AS THE VIEW ENGINE
app.set('view engine','ejs');
//STATIC FILE
app.use(express.static('public'));
app.get('/',(req,res) => {
    res.render('login')
});
app.get('/signup',(req,res)=>{
    res.render('signup');
});
app.post('/signup',async (req,res) => {
   
    const data ={
        userName:req.body.userName,
        Email:req.body.Email,
        Password:req.body.Password,
        confirmPassword:req.body.confirmPassword
    }
    //CHECK THE USER IS ALREADY EXIST
    const existingUser = await collection.findOne({Email:data.Email});
    if(existingUser){
        res.render('signup',{data:"user is already exist"});
    }else{
        //FOR HASHING THE PASSWORD USE BCRYPT
        const saltRound = 10 //NUMBER OF SALT ROUND FOR BCRYPT
        const hashPassword = await bcrypt.hash(data.Password,saltRound);
        data.Password = hashPassword;
        const userData = await collection.insertMany(data);
        console.log(userData);
        res.render('home',{title:req.body.userName})
        
    }  
});
//LOGIN USER
app.post('/login',async (req,res) => {
    try{
       const check = await collection.findOne({userName:req.body.userName});
       if(!check){
          res.render('login',{data:"User Not Found"});
       }else{
 //COMPARE THE HASH PASSWORD FROM THE DATABASE WITH THE PLAIN TEXT
 const isPasswordMatch = await bcrypt.compare(req.body.Password,check.Password);
 if(isPasswordMatch){
    res.render('home',{title:req.body.userName});
 }else{
     // res.send('wrong password... ');
      res.render('login',{error:"password is incorrect"});
 }
       }
    
       
        
    }catch(err){
        res.send(err);

    }
});
app.get('/logout',(req,res)=>{
    req.session.destroy(function(err){
        if(err){
            res.send(err);
        }else{
            res.render('login',{logout:'Logout successfully'});
        }
    });
});


app.listen('3000',()=>{
    console.log('server is running..');
})