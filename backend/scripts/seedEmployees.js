const mongoose = require('mongoose');
const Employee = require('../models/Employee');

const sampleEmployees = [
  {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    position: 'Software Engineer',
    department: 'Engineering',
    salary: 80000,
    status: 'active'
  },
  {
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    position: 'HR Manager',
    department: 'Human Resources',
    salary: 75000,
    status: 'active'
  },
  {
    firstName: 'Mike',
    lastName: 'Johnson',
    email: 'mike.johnson@example.com',
    position: 'Sales Executive',
    department: 'Sales',
    salary: 65000,
    status: 'active'
  },
  {
    firstName: 'Sarah',
    lastName: 'Williams',
    email: 'sarah.williams@example.com',
    position: 'Marketing Specialist',
    department: 'Marketing',
    salary: 70000,
    status: 'active'
  }
];

mongoose.connect('mongodb://localhost:27017/hr-management', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(async () => {
  console.log('Connected to MongoDB');
  
  // Clear existing data
  await Employee.deleteMany({});
  console.log('Cleared existing employee data');
  
  // Insert sample data
  await Employee.insertMany(sampleEmployees);
  console.log('Inserted sample employee data');
  
  // Close connection
  await mongoose.connection.close();
  console.log('Database connection closed');
})
.catch(err => {
  console.error('Error:', err);
  process.exit(1);
}); 