const fs = require('fs-extra');
const path = require('path');

const createUploadsDir = () => {
  const uploadsDir = path.join(__dirname, '../uploads');
  const cvsDir = path.join(uploadsDir, 'cvs');

  try {
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir);
      console.log('Created uploads directory');
    }

    // Create cvs directory if it doesn't exist
    if (!fs.existsSync(cvsDir)) {
      fs.mkdirSync(cvsDir);
      console.log('Created cvs directory');
    }

    console.log('Upload directories are ready');
  } catch (error) {
    console.error('Error creating upload directories:', error);
  }
};

createUploadsDir(); 