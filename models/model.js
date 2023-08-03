const mongoose = require('mongoose');


const registerSchema = mongoose.Schema({
    username:{
        type:String,
        required:[true,"Please add the contact name"],
        unique:true,
    },
    email:{
        type:String,
        required:[true,"Please add the email address"],
        unique:true,
    },
    password:{
        type:String,
        required:[true,"Please add the phone number"],
    }
},
{
    timestamps:true,
})

module.exports = mongoose.model("users",registerSchema);