import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./Components/Sidebar";
import NavBar from './Components/Navbar'; 
import DashboardApp from "./Components/DashboardApp";
import Employees from "./pages/Employees";
import Login from './Components/Login';
import SignIn from './Components/Signin';
import SignUp from './Components/Signup';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Authentication Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signIn" element={<SignIn />} />
        <Route path="/signUp" element={<SignUp />} />

        {/* Dashboard Routes (With Sidebar & Navbar Layout) */}
        <Route path="*" element={
          <div className="dashboard">
            <Sidebar />
            <div className="main-content">
              {/* Ensure NavBar is rendered only once here */}
              <NavBar />
              <Routes>
                <Route path="/" element={<DashboardApp />} />
                <Route path="/employees" element={<Employees />} />
              </Routes>
            </div>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
