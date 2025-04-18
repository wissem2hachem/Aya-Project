// models/job.js

const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
    // Job title (e.g., Software Engineer)
    title: { type: String, required: true, trim: true },

    // Detailed job description
    description: { type: String, required: true },

    // Department or team
    department: { type: String, required: true },

    // Job location (optional for remote roles)
    location: { type: String, default: "Remote" },

    // Employment type (full-time, part-time, etc.)
    employmentType: {
        type: String,
        enum: ["Full-Time", "Part-Time", "Contract", "Internship"],
        required: true
    },

    // Salary range
    salaryRange: {
        min: { type: Number },
        max: { type: Number }
    },

    // Status of the job posting
    status: {
        type: String,
        enum: ["Open", "Closed", "Paused"],
        default: "Open"
    },

    // Date the job was posted
    postedAt: {
        type: Date,
        default: Date.now
    },

    // Who posted the job (reference to User model)
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Job", jobSchema);
