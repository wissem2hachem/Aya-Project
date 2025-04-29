import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Payroll from './pages/Payroll';
// ... other imports

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/payroll" element={<Payroll />} />
        {/* ... other routes */}
      </Routes>
    </Router>
  );
}

export default App; 