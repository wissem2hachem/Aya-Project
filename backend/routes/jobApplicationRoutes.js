const express = require("express");
const router = express.Router();
const JobApplication = require("../models/JobApplication");
const { authenticate } = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");
const fs = require("fs-extra");
const mongoose = require("mongoose");
const Job = require("../models/Job");
const { sendShortlistEmail } = require("../services/emailService");

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "../uploads/cvs");
fs.ensureDirSync(uploadsDir);

// Configure multer for CV uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"), false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter
});

// Submit a new job application
router.post("/apply", upload.single("cv"), async (req, res) => {
  try {
    console.log("Received application submission:", req.body);
    console.log("File received:", req.file);

    const { firstName, lastName, email, degree, jobId } = req.body;

    if (!req.file) {
      console.log("No file received in request");
      return res.status(400).json({ message: "CV file is required" });
    }

    // Convert jobId to ObjectId
    let jobObjectId;
    try {
      jobObjectId = new mongoose.Types.ObjectId(jobId);
    } catch (error) {
      console.log("Invalid job ID format:", jobId);
      return res.status(400).json({ message: "Invalid job ID format" });
    }

    const newApplication = new JobApplication({
      jobId: jobObjectId,
      firstName,
      lastName,
      email,
      degree,
      cv: {
        originalName: req.file.originalname,
        fileName: req.file.filename,
        path: req.file.path,
        mimeType: req.file.mimetype,
        size: req.file.size
      }
    });

    console.log("Saving application:", newApplication);
    await newApplication.save();
    res.status(201).json({ message: "Application submitted successfully" });
  } catch (error) {
    console.error("Error submitting application:", error);
    // Delete the uploaded file if there was an error
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error("Error deleting uploaded file:", unlinkError);
      }
    }
    res.status(500).json({ message: error.message });
  }
});

// Get all job applications (for HR/Admin/Manager)
router.get("/", authenticate, async (req, res) => {
  try {
    // Check if user is HR, admin, or manager
    if (req.user.role !== "hr" && req.user.role !== "admin" && req.user.role !== "manager") {
      return res.status(403).json({ message: "Access denied" });
    }

    const applications = await JobApplication.find()
      .populate("jobId", "title department")
      .sort({ applicationDate: -1 });

    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update application status
router.put("/:id/status", authenticate, async (req, res) => {
  try {
    // Check if user is HR, admin, or manager
    if (req.user.role !== "hr" && req.user.role !== "admin" && req.user.role !== "manager") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { status } = req.body;
    const application = await JobApplication.findById(req.params.id)
      .populate("jobId", "title department");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Update the status
    application.status = status;
    await application.save();

    // If the status is changed to "Shortlisted", send an email
    if (status === "Shortlisted") {
      try {
        // Ensure we have the job title before sending the email
        if (!application.jobId || !application.jobId.title) {
          throw new Error("Job title not found");
        }

        await sendShortlistEmail(
          application.email,
          `${application.firstName} ${application.lastName}`,
          application.jobId.title
        );
        console.log('Shortlist email sent successfully to:', application.email);
      } catch (emailError) {
        console.error("Error sending shortlist email:", emailError);
        // Return a success response for the status update but include email error
        return res.status(200).json({
          ...application.toObject(),
          emailError: "Failed to send notification email. Status was updated successfully."
        });
      }
    }

    res.status(200).json(application);
  } catch (error) {
    console.error("Error updating application status:", error);
    res.status(500).json({ message: error.message });
  }
});

// Download CV
router.get("/:id/cv", authenticate, async (req, res) => {
  try {
    // Check if user is HR, admin, or manager
    if (req.user.role !== "hr" && req.user.role !== "admin" && req.user.role !== "manager") {
      return res.status(403).json({ message: "Access denied" });
    }

    const application = await JobApplication.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    const filePath = application.cv.path;
    console.log("Attempting to download CV from path:", filePath);
    
    if (!fs.existsSync(filePath)) {
      console.error("CV file not found at path:", filePath);
      return res.status(404).json({ message: "CV file not found" });
    }

    // Set headers for file download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${application.cv.originalName}"`);
    
    // Stream the file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
    
    fileStream.on('error', (error) => {
      console.error('Error streaming file:', error);
      res.status(500).json({ message: 'Error downloading file' });
    });
  } catch (error) {
    console.error('Error in CV download:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get all job offers
router.get("/offers", async (req, res) => {
  try {
    const jobOffers = await Job.find({ status: "Open" })
      .select('title company location employmentType department description salaryRange postedAt')
      .sort({ postedAt: -1 });

    const formattedOffers = jobOffers.map(job => ({
      _id: job._id,
      title: job.title,
      company: job.company || "Our Company",
      location: job.location,
      type: job.employmentType,
      category: job.department,
      description: job.description,
      requirements: [], // You can add requirements field to the Job model if needed
      salary: job.salaryRange ? `$${job.salaryRange.min} - $${job.salaryRange.max}` : "Competitive",
      postedDate: formatPostedDate(job.postedAt)
    }));

    res.status(200).json(formattedOffers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Helper function to format posted date
function formatPostedDate(date) {
  const now = new Date();
  const posted = new Date(date);
  const diffInDays = Math.floor((now - posted) / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return "Today";
  if (diffInDays === 1) return "Yesterday";
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  return `${Math.floor(diffInDays / 30)} months ago`;
}

// Delete a job application
router.delete("/:id", authenticate, async (req, res) => {
  try {
    // Check if user is HR, admin, or manager
    if (req.user.role !== "hr" && req.user.role !== "admin" && req.user.role !== "manager") {
      return res.status(403).json({ message: "Access denied" });
    }

    const application = await JobApplication.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Delete the CV file if it exists
    if (application.cv && application.cv.path) {
      try {
        await fs.unlink(application.cv.path);
      } catch (unlinkError) {
        console.error("Error deleting CV file:", unlinkError);
      }
    }

    // Delete the application
    await application.deleteOne();

    res.status(200).json({ message: "Application deleted successfully" });
  } catch (error) {
    console.error("Error deleting application:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 