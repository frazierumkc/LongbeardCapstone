import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import LandingPage from "./pages/LandingPage";
import Dashboard  from "./pages/Dashboard";
import Contacts   from "./pages/Contacts";
import History    from "./pages/History";
import Profile    from "./pages/Profile";

const App = () => {
  return (
    <Router>
      <NavBar />
      <Routes>
        {/* New landing page: */}
        <Route path="/" element={<LandingPage />} />

        {/* Your “real” sections: */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/contacts"  element={<Contacts />} />
        <Route path="/history"   element={<History />} />
        <Route path="/profile"   element={<Profile />} />

        {/* Fallback to dashboard if you want */}
        {/* <Route path="*" element={<Dashboard />} /> */}
      </Routes>
    </Router>
  );
};

export default App;