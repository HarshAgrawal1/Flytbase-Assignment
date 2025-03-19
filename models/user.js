const mongoose=require('mongoose');
const dotenv = require("dotenv");
require("dotenv").config();

const mongo=process.env.MONGO;
mongoose.connect(mongo);


const userSchema=mongoose.Schema({
    name:String,
    email:String,
    phone:String,
    password:String,
    connections: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }]
});

module.exports=mongoose.model('user',userSchema);