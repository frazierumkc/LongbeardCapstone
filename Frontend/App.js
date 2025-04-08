import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Expenses from "./pages/Expenses";
import Requests from "./pages/Requests";
import Contacts from "./pages/Contacts";
import History from "./pages/History";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

const App = () => {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/requests" element={<Requests />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/history" element={<History />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/" element={<Expenses />} />
      </Routes>
    </Router>
  );
};

export default App;
