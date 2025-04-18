const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();
const nodemailer = require("nodemailer");
const crypto = require("crypto");

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
        
        // Setup email transporter
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
        
        // Email options
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Password Reset Request",
            text: `Reset your password by visiting this link: ${resetUrl}`, // Plain text version
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
                    <h1 style="color: #333; text-align: center;">Password Reset</h1>
                    <p style="color: #555; font-size: 16px;">You requested a password reset. Please click the button below to reset your password:</p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${resetUrl}" style="background-color: #4a6cf7; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Reset Password</a>
                    </div>
                    
                    <p style="color: #555; font-size: 14px;">If the button doesn't work, copy and paste this link into your browser:</p>
                    <p style="background-color: #f5f5f5; padding: 10px; border-radius: 3px; word-break: break-all; font-size: 14px;">${resetUrl}</p>
                    
                    <p style="color: #555; font-size: 14px;">This link will expire in 30 minutes.</p>
                    <p style="color: #777; font-size: 14px;">If you did not request this, please ignore this email.</p>
                    
                    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #777; font-size: 12px;">
                        <p>This is an automated email. Please do not reply.</p>
                    </div>
                </div>
            `
        };
        
        // Send email
        await transporter.sendMail(mailOptions);
        
        res.status(200).json({ 
            success: true,
            message: "Password reset link sent to your email"
        });
        
    } catch (error) {
        console.error("Password reset error:", error);
        res.status(500).json({ 
            success: false,
            message: "Failed to send reset email. Please try again later." 
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








