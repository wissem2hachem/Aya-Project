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
    
    // User role
    role: { type: String, required: true, enum: ['employee', 'admin'], default: 'employee' },
    
    // User's hashed password
    password: { type: String, required: true },
    
    // Profile fields
    department: { type: String, default: '' },
    position: { type: String, default: '' },
    phone: { type: String, default: '' },
    location: { type: String, default: '' },
    bio: { type: String, default: '' },
    avatar: { type: String, default: '' },
    joinDate: { type: Date, default: Date.now },
    
    // Skills and certifications
    skills: [{ type: String }],
    certifications: [{
        name: { type: String, default: 'Certificate' },
        issuer: { type: String },
        issueDate: { type: Date },
        expiryDate: { type: Date },
        credentialID: { type: String },
        // Certificate file information
        file: {
            originalName: { type: String },
            fileName: { type: String },
            path: { type: String },
            mimeType: { type: String },
            size: { type: Number },
            uploadDate: { type: Date, default: Date.now }
        }
    }],
    
    // Emergency contact
    emergencyContact: {
        name: { type: String, default: '' },
        relationship: { type: String, default: '' },
        phone: { type: String, default: '' },
        email: { type: String, default: '' }
    },
    
    // Work history within the company
    workHistory: [{
        position: { type: String },
        department: { type: String },
        startDate: { type: Date },
        endDate: { type: Date },
        achievements: [{ type: String }]
    }],
    
    // Social profiles
    socialProfiles: {
        linkedin: { type: String, default: '' },
        twitter: { type: String, default: '' },
        github: { type: String, default: '' }
    },
    
    // Profile completion percentage
    profileCompletion: { type: Number, default: 20 },
    
    // Password reset fields
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null }
},
{
    // Automatically add createdAt and updatedAt timestamps
    timestamps: true,
});

// Export the User model
module.exports = mongoose.model("User", userSchema);

