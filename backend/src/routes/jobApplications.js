const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const JobApplication = require('../models/JobApplication');
const NotificationService = require('../services/notificationService');

// Create a new job application
router.post('/', async (req, res) => {
  try {
    const jobApplication = new JobApplication({
      ...req.body,
      status: 'pending'
    });

    await jobApplication.save();

    // Create notification for admin
    await NotificationService.createJobApplicationNotification(jobApplication);

    res.status(201).json(jobApplication);
  } catch (error) {
    console.error('Error creating job application:', error);
    res.status(500).json({ message: 'Error creating job application' });
  }
});

// Get all job applications (admin only)
router.get('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const applications = await JobApplication.find()
      .populate('jobId', 'title')
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    console.error('Error fetching job applications:', error);
    res.status(500).json({ message: 'Error fetching job applications' });
  }
});

// Update job application status (admin only)
router.put('/:id/status', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { status } = req.body;
    const application = await JobApplication.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('jobId', 'title');

    if (!application) {
      return res.status(404).json({ message: 'Job application not found' });
    }

    // Create notification for candidate about status update
    await NotificationService.createAdminNotification(
      'job_application_update',
      `Your application for ${application.jobId.title} has been ${status}`,
      {
        applicationId: application._id,
        jobId: application.jobId._id,
        jobTitle: application.jobId.title,
        status
      }
    );

    res.json(application);
  } catch (error) {
    console.error('Error updating job application status:', error);
    res.status(500).json({ message: 'Error updating job application status' });
  }
});

module.exports = router; 