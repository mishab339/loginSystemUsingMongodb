const mongoose = require('mongoose');
 const connect = mongoose.connect("mongodb://localhost:27017/logindb");
//CHECK DATA BASE CONNECTED OR NOT
connect.then(()=>{
    console.log("Database connected...!");
}).catch(()=>{
    console.log('Database cannot be connected...');
})
const loginSchema = new mongoose.Schema({
    userName:{
        type:String,
        required:true
    },
    Email:{
        type:String,
        required:true
    },
    Password:{
        type:String,
        required:true
    },
    confirmPassword:{
        type:String,
        required:true
    }
});
//COLLECTION PART
const collection = new mongoose.model('users',loginSchema);

module.exports = collection;