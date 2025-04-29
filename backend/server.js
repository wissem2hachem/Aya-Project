require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const app = express();
const userRoutes = require("./routes/userRoutes")
const jobRoutes = require("./routes/jobRoutes");
const leaveRequestRoutes = require("./routes/leaveRequestRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
const payrollRoutes = require("./routes/payrollRoutes");
const path = require("path");
const fs = require("fs-extra");
const employeeRoutes = require('./routes/employeeRoutes');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
const cvsDir = path.join(uploadsDir, 'cvs');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
if (!fs.existsSync(cvsDir)) {
  fs.mkdirSync(cvsDir);
}

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//connect to mongodb
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.log(err));

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/certificates", require("./routes/certificateRoutes"));
app.use("/api/job-applications", require("./routes/jobApplicationRoutes"));
app.use("/api/jobs", jobRoutes);
app.use("/api/leave-requests", leaveRequestRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/payroll", payrollRoutes);
app.use('/api/employees', employeeRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



