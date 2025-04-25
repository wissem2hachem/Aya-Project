const mongoose = require("mongoose");

const jobApplicationSchema = new mongoose.Schema({
  // Reference to the job being applied for
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true
  },

  // Candidate information
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  degree: {
    type: String,
    required: true
  },

  // CV file information
  cv: {
    originalName: { type: String },
    fileName: { type: String },
    path: { type: String },
    mimeType: { type: String },
    size: { type: Number },
    uploadDate: { type: Date, default: Date.now }
  },

  // Application status
  status: {
    type: String,
    enum: ["Pending", "Reviewed", "Shortlisted", "Rejected"],
    default: "Pending"
  },

  // Application date
  applicationDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("JobApplication", jobApplicationSchema); 