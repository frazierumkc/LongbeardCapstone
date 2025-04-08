import React from "react";
import { Link, useLocation } from "react-router-dom";

const NavBar = () => {
  const location = useLocation();
  return (
    <nav style={{ backgroundColor: "rgb(0, 128, 0)", padding: "15px", display: "flex", alignItems: "center" }}>
      <div style={{ marginRight: "auto", color: "white", fontSize: "1.5rem", fontWeight: "bold" }}>Logo</div>
      <ul style={{ listStyle: "none", display: "flex", gap: "20px", margin: 0, padding: 0 }}>
        {["Expenses", "Requests", "Contacts", "History", "Profile", "Settings"].map((page) => {
          const isActive = location.pathname === `/${page.toLowerCase()}`;
          return (
            <li key={page}>
              <Link
                to={`/${page.toLowerCase()}`}
                style={{
                  color: isActive ? "rgb(0, 128, 0)" : "white",
                  backgroundColor: isActive ? "white" : "transparent",
                  padding: "10px 15px",
                  borderRadius: "5px",
                  textDecoration: "none",
                  fontSize: "1.2rem",
                }}
              >
                {page}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default NavBar;
