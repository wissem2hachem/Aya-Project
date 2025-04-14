/**
 * User Model Schema
 * Defines the structure for user documents in the database
 */

const mongoose = require("mongoose");

// Define the user schema with required fields
const userSchema = new mongoose.Schema({    
    // User's full name
    name: { type: String, required: true },
    
    // User's email address (must be unique)
    email: { type: String, required: true, unique: true },
    role:{type:String ,require:true, enum:['Admin','Manager','Employee'], default:'Employee'},
    // User's hashed password
    password: { type: String, required: true },
},
{
    // Automatically add createdAt and updatedAt timestamps
    timestamps: true,
});

// Export the User model
module.exports = mongoose.model("User", userSchema);

