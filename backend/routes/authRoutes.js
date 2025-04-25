const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const { sendPasswordResetEmail } = require("../services/emailService");

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

// Forgot password - send reset email
router.post("/forgot-password", async (req, res) => {
    try {
        const { email } = req.body;
        
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: "User with this email does not exist" 
            });
        }
        
        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString("hex");
        
        // Store reset token and expiry in user document
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 30 * 60 * 1000; // 30 minutes
        await user.save();
        
        // Create reset URL - Make sure it's properly encoded
        const resetUrl = encodeURI(`http://localhost:3000/reset-password/${resetToken}`);
        
        try {
            // Send email using the email service
            await sendPasswordResetEmail(email, resetUrl);
            
            res.status(200).json({ 
                success: true,
                message: "Password reset link sent to your email"
            });
        } catch (emailError) {
            console.error("Email sending error:", emailError);
            
            // Clear the reset token since email failed
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            await user.save();
            
            // Return appropriate error message
            if (emailError.message.includes('Invalid email address')) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid email address format"
                });
            } else if (emailError.message.includes('recipient not found')) {
                return res.status(400).json({
                    success: false,
                    message: "Email address not found or unable to receive mail"
                });
            } else if (emailError.message.includes('authentication failed')) {
                return res.status(500).json({
                    success: false,
                    message: "Email service configuration error. Please contact support."
                });
            } else {
                return res.status(500).json({
                    success: false,
                    message: "Failed to send reset email. Please try again later."
                });
            }
        }
    } catch (error) {
        console.error("Password reset error:", error);
        res.status(500).json({ 
            success: false,
            message: "An unexpected error occurred. Please try again later." 
        });
    }
});

// Reset password with token
router.post("/reset-password/:token", async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;
        
        // Find user with the token and check if token is still valid
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });
        
        if (!user) {
            return res.status(400).json({ 
                success: false,
                message: "Password reset token is invalid or has expired" 
            });
        }
        
        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        
        // Clear reset token fields
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        
        await user.save();
        
        res.status(200).json({ 
            success: true,
            message: "Password has been reset successfully" 
        });
        
    } catch (error) {
        console.error("Password reset error:", error);
        res.status(500).json({ 
            success: false,
            message: "Failed to reset password. Please try again later." 
        });
    }
});

module.exports = router;








