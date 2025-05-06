import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaTachometerAlt, FaAddressBook, FaHistory, FaUser } from "react-icons/fa";

const NavBar = () => {
  const location = useLocation();
  const navItems = [
    { name: "Dashboard", icon: <FaTachometerAlt /> },
    { name: "Contacts", icon: <FaAddressBook /> },
    { name: "History", icon: <FaHistory /> },
    { name: "Profile", icon: <FaUser /> }
  ];

  return (
    <nav
      style={{
        backgroundColor: "#129238",
        height: "10vh",
        display: "flex",
        alignItems: "center",
        position: "fixed",
        width: "100vw",
        top: 0,
        boxShadow: "0 3px 5px rgba(0,70,0,0.4)",
        zIndex: 1000
      }}
    >
      <div
        style={{
          marginRight: "auto",
          marginTop: "5px",
          marginLeft: 20
        }}
      >
        <img
          src="/split_logo.png"
          alt="Logo"
          style={{
            maxHeight: "50px", // Optional: prevent it from being too large
            objectFit: "contain"
          }}
        />
      </div>
      <ul
        style={{
          listStyle: "none",
          display: "flex",
          gap: "20px",
          marginRight: 20,
          padding: 0
        }}
      >
        {navItems.map(({ name, icon }) => {
          const isActive = location.pathname === `/${name.toLowerCase()}`;
          return (
            <li key={name}>
              <Link
                to={`/${name.toLowerCase()}`}
                style={{
                  color: isActive ? "rgb(0, 128, 0)" : "white",
                  backgroundColor: isActive ? "white" : "transparent",
                  textShadow: isActive
                    ? "2px 2px 4px rgba(0, 60, 0, 0.2)"
                    : "2px 2px 4px rgba(0, 60, 0, 0.6)",
                  fontWeight: "bold",
                  padding: "10px 15px",
                  borderRadius: "5px",
                  textDecoration: "none",
                  fontSize: "1.2rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}
              >
                {icon}
                {name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default NavBar;
