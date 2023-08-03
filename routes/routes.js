const express = require("express");
const users = require("../models/model");
const validuser = require("../configs/validation");
const bcrypt = require("bcrypt");

const router = express.Router();


router.post('/',(req,res) => {
    console.log("The request body is : ",req.body);
    const {username,email,password} = req.body;
    // if(!username || !email || !password){
    //     res.status(400).json({message:"Username or Email or Password does not exist"});
    // }
    const {value,error} = validuser(req.body);
    if(error){
        res.status(400).json({message:error.details});
    }else{
        res.status(200).json(value);
        const hashedpass = bcrypt.hash(value.password);
        const name = value.username;
        const mail = value.email;
        const contact = users.create({
            name,
            mail,
            hashedpass
        });
        res.status(201).json(contact);
    }
});

router.get('/',(req,res) => {
    const contacts = users.find();
    res.status(200).json(contacts);
});

router.post('/register',(req,res) => {
    const {value,error} = validuser(req.body);
    if(error){
        res.status(400).json({message:error.details});
    }else{
        res.status(200).json(value);
    }
});

module.exports = router;