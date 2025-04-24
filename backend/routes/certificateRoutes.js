const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authenticate, authorizeUser } = require('../middleware/authMiddleware');
const { handleCertificateUpload } = require('../middleware/uploadMiddleware');
const path = require('path');
const fs = require('fs-extra');

// POST /api/certificates/:userId
// Upload a new certificate for a user
router.post('/:userId', authenticate, authorizeUser, handleCertificateUpload, async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    
    if (!user) {
      // Delete the uploaded file if user not found
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({ message: 'User not found' });
    }
    
    // If no file was uploaded, return error
    if (!req.file) {
      return res.status(400).json({ message: 'No certificate file uploaded' });
    }
    
    // Create a new certificate entry
    const newCertificate = {
      name: req.body.name || 'Certificate',
      issuer: req.body.issuer,
      issueDate: req.body.issueDate,
      expiryDate: req.body.expiryDate,
      credentialID: req.body.credentialID,
      file: {
        originalName: req.file.originalname,
        fileName: req.file.filename,
        path: req.file.path.replace(/\\/g, '/'),
        mimeType: req.file.mimetype,
        size: req.file.size,
        uploadDate: new Date()
      }
    };
    
    // Add the certificate to the user's certifications array
    user.certifications.push(newCertificate);
    
    // Update profile completion if needed
    if (user.certifications.length === 1) {
      // This is the first certificate, might affect profile completion
      const fieldsWithValues = [
        user.name, user.email, user.department, user.position, 
        user.phone, user.location, user.bio, user.avatar, 
        user.skills.length > 0, true, // Now certifications has value
        Object.values(user.emergencyContact).some(val => val), 
        user.workHistory.length > 0,
        Object.values(user.socialProfiles).some(val => val)
      ];
      
      const completedFields = fieldsWithValues.filter(Boolean).length;
      const totalFields = fieldsWithValues.length;
      user.profileCompletion = Math.round((completedFields / totalFields) * 100);
    }
    
    await user.save();
    
    res.status(201).json({
      message: 'Certificate uploaded successfully',
      certificate: newCertificate
    });
  } catch (error) {
    // Delete the uploaded file if there was an error
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: error.message });
  }
});

// GET /api/certificates/:userId/:certificateId
// Get a certificate file
router.get('/:userId/:certificateId', async (req, res) => {
  try {
    // Check for token in query parameter
    const token = req.query.token;
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    
    // Manually decode and verify the token here
    // This is a simple approach - in a production app you'd want to reuse the authenticate middleware
    // by extracting the token verification logic into a separate function
    try {
      const decoded = require('jsonwebtoken').verify(token, process.env.JWT_SECRET);
      req.user = decoded;
    } catch (err) {
      return res.status(401).json({ message: 'Invalid token.' });
    }
    
    const { userId, certificateId } = req.params;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Find the certificate in the user's certifications array
    const certificate = user.certifications.id(certificateId);
    if (!certificate || !certificate.file || !certificate.file.path) {
      return res.status(404).json({ message: 'Certificate not found' });
    }
    
    // Check if the file exists
    if (!fs.existsSync(certificate.file.path)) {
      return res.status(404).json({ message: 'Certificate file not found' });
    }
    
    // Send the file
    res.sendFile(path.resolve(certificate.file.path));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/certificates/:userId/:certificateId
// Delete a certificate
router.delete('/:userId/:certificateId', authenticate, authorizeUser, async (req, res) => {
  try {
    const { userId, certificateId } = req.params;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Find the certificate in the user's certifications array
    const certificate = user.certifications.id(certificateId);
    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }
    
    // Delete the file if it exists
    if (certificate.file && certificate.file.path && fs.existsSync(certificate.file.path)) {
      fs.unlinkSync(certificate.file.path);
    }
    
    // Remove the certificate from the user's certifications array
    user.certifications.pull(certificateId);
    
    await user.save();
    
    res.status(200).json({ message: 'Certificate deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 