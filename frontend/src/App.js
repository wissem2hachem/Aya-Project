import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./Components/Sidebar";
import NavBar from './Components/Navbar'; 
import DashboardApp from "./Components/DashboardApp";
import Employees from "./pages/Employees";
import Login from './Components/Login';
import SignIn from './Components/Signin';
import SignUp from './Components/Signup';

function App() {
  return (
    <Router>
      {/* Only show sidebar on certain routes */}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signIn" element={<SignIn />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="*" element={
          <div className="dashboard">
            <Sidebar />
            <div className="main-content">
              <Routes>
                <Route path="/" element={<DashboardApp />} />
                <Route path="/employees" element={<Employees />} />
                <Route path="/sidebar" element={<Sidebar />} />
                <Route path="/navbar" element={<NavBar />} />
              </Routes>
            </div>
          </div>
        } />
      </Routes>

    </Router>
  );
}

export default App;