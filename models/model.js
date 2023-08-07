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
        required:[true,"Please add the password"],
    },
    country:{
        type:String,
        required:[true,"Please add your country"],
    },
    state:{
        type:String,
        require:[true,"Please add your state"],
    }
},
{
    timestamps:true,
});

module.exports = mongoose.model("users",registerSchema);