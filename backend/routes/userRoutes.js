const express = require("express");
const User = require("../models/User");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { authenticate, authorizeUser } = require("../middleware/authMiddleware");

// Get All Users (READ)
router.get("/", authenticate, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get User Profile by ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get Current User Profile
router.get("/profile/me", async (req, res) => {
  try {
    // Token verification would be here in a middleware
    const userId = req.user ? req.user._id : null; // This would come from auth middleware
    
    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create New User (CREATE)
router.post("/create", authenticate, async (req, res) => {
  try {
    // Check if user has admin role
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "Only administrators can create users" });
    }

    const { name, email, password, role } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({ 
      name, 
      email, 
      password: hashedPassword,
      role: role || 'employee'
    });
    
    await newUser.save();

    // Don't return the password
    const userResponse = newUser.toObject();
    delete userResponse.password;

    res.status(201).json(userResponse);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update User Basic Info (UPDATE)
router.put("/:id", async (req, res) => {
  try {
    const { name, email, role, currentPassword, password, ...profileData } = req.body;
    
    // Find user
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const updateData = { name, email, role };
    
    // If password change is requested
    if (password && currentPassword) {
      // Verify current password
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }
      
      // Hash new password
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }
    
    // Update profile completion percentage
    if (Object.keys(profileData).length > 0) {
      // Merge profileData into updateData
      Object.assign(updateData, profileData);
      
      // Calculate profile completion
      updateData.profileCompletion = calculateProfileCompletion({
        ...user.toObject(),
        ...updateData
      });
    }
    
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).select('-password');
    
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update User Profile Fields
router.put("/:id/profile", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const {
      department, position, phone, location, bio,
      skills, certifications, emergencyContact,
      socialProfiles
    } = req.body;
    
    const updateData = {};
    
    // Update specific fields if provided
    if (department) updateData.department = department;
    if (position) updateData.position = position;
    if (phone) updateData.phone = phone;
    if (location) updateData.location = location;
    if (bio) updateData.bio = bio;
    if (skills) updateData.skills = skills;
    if (certifications) updateData.certifications = certifications;
    if (emergencyContact) updateData.emergencyContact = emergencyContact;
    if (socialProfiles) updateData.socialProfiles = socialProfiles;
    
    // Calculate profile completion
    updateData.profileCompletion = calculateProfileCompletion({
      ...user.toObject(),
      ...updateData
    });
    
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).select('-password');
    
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add Work History Entry
router.post("/:id/work-history", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const { position, department, startDate, endDate, achievements } = req.body;
    
    user.workHistory.push({
      position,
      department,
      startDate,
      endDate,
      achievements: achievements || []
    });
    
    // Recalculate profile completion
    user.profileCompletion = calculateProfileCompletion(user);
    
    await user.save();
    
    res.status(200).json(user.workHistory);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete User (DELETE)
router.delete("/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Helper function to calculate profile completion percentage
function calculateProfileCompletion(user) {
  // Define fields that contribute to completion
  const fields = [
    'name', 'email', 'department', 'position', 'phone', 
    'location', 'bio', 'avatar', 'skills', 'certifications', 
    'emergencyContact', 'workHistory', 'socialProfiles'
  ];
  
  let completedFields = 0;
  
  // Check basic fields
  for (const field of ['name', 'email', 'department', 'position', 'phone', 'location', 'bio']) {
    if (user[field] && user[field].toString().trim() !== '') {
      completedFields++;
    }
  }
  
  // Check avatar
  if (user.avatar) completedFields++;
  
  // Check array fields
  if (user.skills && user.skills.length > 0) completedFields++;
  if (user.certifications && user.certifications.length > 0) completedFields++;
  if (user.workHistory && user.workHistory.length > 0) completedFields++;
  
  // Check nested objects
  if (user.emergencyContact) {
    const hasValues = Object.values(user.emergencyContact).some(val => val && val.toString().trim() !== '');
    if (hasValues) completedFields++;
  }
  
  if (user.socialProfiles) {
    const hasValues = Object.values(user.socialProfiles).some(val => val && val.toString().trim() !== '');
    if (hasValues) completedFields++;
  }
  
  // Calculate percentage (round to nearest whole number)
  return Math.round((completedFields / fields.length) * 100);
}

module.exports = router;