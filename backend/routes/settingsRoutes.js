const express = require("express");
const router = express.Router();

// Default system settings
const defaultSettings = {
  companyName: "HRHub",
  workingHoursStart: "09:00",
  workingHoursEnd: "17:00",
  timeZone: "UTC",
  dateFormat: "MM/DD/YYYY",
  languagePreference: "en",
  enableEmailNotifications: true
};

// In-memory storage for settings (in a production app, this would be in a database)
let systemSettings = { ...defaultSettings };

// Get system settings
router.get("/", (req, res) => {
  try {
    res.status(200).json(systemSettings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update system settings
router.put("/", (req, res) => {
  try {
    // Update only the fields that are provided
    const updateData = req.body;
    
    // Validate fields if needed
    if (updateData.companyName && updateData.companyName.length > 50) {
      return res.status(400).json({ message: "Company name too long" });
    }
    
    // Update the settings
    systemSettings = {
      ...systemSettings,
      ...updateData
    };
    
    res.status(200).json(systemSettings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Reset system settings to default
router.post("/reset", (req, res) => {
  try {
    systemSettings = { ...defaultSettings };
    res.status(200).json(systemSettings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 