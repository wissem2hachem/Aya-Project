const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

// register user
router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body; 
        // check if user already exists
        let user = await User.findOne({email});
        if(user) {
            return res.status(400).json({message: "User already exists"});
        }
        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        // create new user
        user = new User({name, email, password: hashedPassword});
        await user.save();
        res.status(201).json({message: "User registered successfully"});
    } catch(error) {
        res.status(500).json({ message: error.message });

    }
});

// login user
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        // check if user exists
        const user = await User.findOne({email});
        if(!user) {
            return res.status(400).json({message: "Invalid emil"});
        }
        //compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(400).json({message: "Invalid credentials"});
        }
        //generate jwt token
        const token = jwt.sign({_id: user._id,role:user.role}, process.env.JWT_SECRET, {expiresIn: "1h"});
        res.cookie("token", token, {httpOnly: true});
        res.status(200).json({message: "Logged in successfully", token}); 
    } catch(error) {
        res.status(500).json({message: error.message});
    }
}); 

// logout user
router.post("/logout", (req, res) => {
    res.cookie("token", "", {httpOnly: true, expires: new Date(0)});
    res.status(200).json({message: "Logged out "});
});





module.exports = router;








