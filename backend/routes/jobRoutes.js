const express = require("express");
const Job = require("../models/Job");
const router = express.Router();

// Get All Jobs (READ)
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find().populate('postedBy', 'name email');
    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get Single Job by ID (READ)
router.get("/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('postedBy', 'name email');
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.status(200).json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create New Job (CREATE)
router.post("/create", async (req, res) => {
  try {
    const { 
      title, 
      description, 
      department, 
      location, 
      employmentType, 
      salaryRange,
      status,
      postedBy 
    } = req.body;
    
    const newJob = new Job({
      title,
      description,
      department,
      location,
      employmentType,
      salaryRange,
      status,
      postedBy
    });

    const savedJob = await newJob.save();
    res.status(201).json(savedJob);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update Job (UPDATE)
router.put("/:id", async (req, res) => {
  try {
    const { 
      title, 
      description, 
      department, 
      location, 
      employmentType, 
      salaryRange,
      status
    } = req.body;
    
    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      { 
        title, 
        description, 
        department, 
        location, 
        employmentType, 
        salaryRange,
        status
      },
      { new: true }
    );

    if (!updatedJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json(updatedJob);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete Job (DELETE)
router.delete("/:id", async (req, res) => {
  try {
    const deletedJob = await Job.findByIdAndDelete(req.params.id);
    
    if (!deletedJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json({ message: "Job deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 