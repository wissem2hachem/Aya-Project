const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');
const { v4: uuidv4 } = require('uuid');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
const certificatesDir = path.join(uploadsDir, 'certificates');
fs.ensureDirSync(uploadsDir);
fs.ensureDirSync(certificatesDir);

// Configure storage for certificate uploads
const certificateStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, certificatesDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with original extension
    const fileExt = path.extname(file.originalname);
    const fileName = `${uuidv4()}${fileExt}`;
    cb(null, fileName);
  }
});

// File filter for certificates
const certificateFilter = (req, file, cb) => {
  // Accept only PDF, JPG, JPEG, and PNG files
  const allowedFileTypes = /jpeg|jpg|png|pdf/;
  const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedFileTypes.test(file.mimetype);
  
  if (extname && mimetype) {
    return cb(null, true);
  } else {
    return cb(new Error('Only PDF, JPG, JPEG, and PNG files are allowed!'), false);
  }
};

// Export certificate upload middleware
const uploadCertificate = multer({
  storage: certificateStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: certificateFilter
}).single('certificateFile');

// Middleware to handle certificate uploads
const handleCertificateUpload = (req, res, next) => {
  uploadCertificate(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // Multer error (e.g., file too large)
      return res.status(400).json({ message: `Upload error: ${err.message}` });
    } else if (err) {
      // Other errors (e.g., file type)
      return res.status(400).json({ message: err.message });
    }
    
    next();
  });
};

module.exports = { handleCertificateUpload }; 