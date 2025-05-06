import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css"; // global styles

const LandingPage = () => {
  const [view, setView] = useState("choose"); // "choose", "login", "signup"
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signUpData, setSignUpData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const navigate = useNavigate();

  // ─── LOGIN ───
  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: loginData.email,
        password: loginData.password
      })
    });

    if (res.ok) {
      const { account_id } = await res.json();
      localStorage.setItem("currentId", account_id);
      navigate("/dashboard");
    } else {
      const err = await res.json();
      alert(err.error || "Login failed");
    }
  };

  // ─── SIGN UP ───
  const handleSignUpSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/accounts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        first_name:  signUpData.firstName,
        last_name:   signUpData.lastName,
        email:       signUpData.email,
        password:    signUpData.password
      })
    });

    if (res.ok) {
      const { account_id } = await res.json();
      localStorage.setItem("currentId", account_id);
      navigate("/dashboard");
    } else {
      const err = await res.json();
      alert(err.error || "Sign up failed");
    }
  };

  // ─── STYLES ───
  const outerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundImage: "url('/triangle.png')",
    backgroundSize: "contain",
    backgroundPosition: "center",
    backgroundRepeat: "repeat"
  };

  const panelStyle = {
    backgroundColor: "rgba(0,128,0,0.85)",
    borderRadius: "40px",
    padding: "3rem 2rem",
    width: view === "choose" ? "500px" : view === "login" ? "450px" : "500px",
    maxWidth: "90%",
    boxShadow: "0 6px 12px rgba(0,70,0,0.8)",
    textAlign: "center",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1.5rem"
  };

  const buttonStyle = {
    backgroundColor: "#fff",
    color: "#005f3c",
    padding: "0.75rem 2rem",
    margin: "0.5rem 0",
    border: "none",
    borderRadius: "30px",
    fontSize: "1rem",
    fontWeight: "bold",
    cursor: "pointer",
    boxShadow: "0 2px 4px rgba(0,70,0,0.6)",
    minWidth: "120px"
  };

  const inputStyle = {
    width: "100%",
    padding: "0.75rem 1rem",
    borderRadius: "30px",
    border: "none",
    fontSize: "1rem",
    boxSizing: "border-box"
  };

  const backButtonStyle = {
    position: "absolute",
    top: "1rem",
    left: "1rem",
    backgroundColor: "#fff",
    color: "#005f3c",
    border: "none",
    borderRadius: "30px",
    padding: "0.5rem 1rem",
    cursor: "pointer",
    boxShadow: "0 2px 4px rgba(0,70,0,0.6)",
    fontWeight: "bold",
    fontSize: "0.9rem"
  };

  // ─── RENDER ───
  return (
    <div style={outerStyle}>
      <div style={panelStyle}>
        {view !== "choose" && (
          <button style={backButtonStyle} onClick={() => setView("choose")}>
            ← Back
          </button>
        )}

        <img
          src="/split_logo.png"
          alt="Split Logo"
          style={{
            width: "150px",
            height: "auto",
            marginTop: view === "choose" ? 0 : "2rem"
          }}
        />

        {view === "choose" && (
          <>
            <button style={buttonStyle} onClick={() => setView("login")}>
              LOG IN
            </button>
            <button style={buttonStyle} onClick={() => setView("signup")}>
              SIGN UP
            </button>
          </>
        )}

        {view === "login" && (
          <form
            onSubmit={handleLoginSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              width: "100%",
              marginTop: "1rem"
            }}
          >
            <input
              type="email"
              placeholder="Email@example.com"
              value={loginData.email}
              onChange={(e) =>
                setLoginData({ ...loginData, email: e.target.value })
              }
              style={inputStyle}
            />
            <input
              type="password"
              placeholder="Password"
              value={loginData.password}
              onChange={(e) =>
                setLoginData({ ...loginData, password: e.target.value })
              }
              style={inputStyle}
            />
            <button type="submit" style={buttonStyle}>
              LOG IN
            </button>
          </form>
        )}

        {view === "signup" && (
          <form
            onSubmit={handleSignUpSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              width: "100%",
              marginTop: "1rem"
            }}
          >
            <input
              type="text"
              placeholder="First name"
              value={signUpData.firstName}
              onChange={(e) =>
                setSignUpData({ ...signUpData, firstName: e.target.value })
              }
              style={inputStyle}
            />
            <input
              type="text"
              placeholder="Last name"
              value={signUpData.lastName}
              onChange={(e) =>
                setSignUpData({ ...signUpData, lastName: e.target.value })
              }
              style={inputStyle}
            />
            <input
              type="email"
              placeholder="Email@example.com"
              value={signUpData.email}
              onChange={(e) =>
                setSignUpData({ ...signUpData, email: e.target.value })
              }
              style={inputStyle}
            />
            <input
              type="password"
              placeholder="Password"
              value={signUpData.password}
              onChange={(e) =>
                setSignUpData({ ...signUpData, password: e.target.value })
              }
              style={inputStyle}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={signUpData.confirmPassword}
              onChange={(e) =>
                setSignUpData({ ...signUpData, confirmPassword: e.target.value })
              }
              style={inputStyle}
            />
            <button type="submit" style={buttonStyle}>
              SIGN UP
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default LandingPage;