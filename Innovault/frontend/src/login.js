import React, { useState } from "react";
import "./login.css"; // Ensure you have the corresponding CSS file

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Predefined credentials
  const predefinedUsername = "admin";
  const predefinedPassword = "1234";

  const handleLogin = (e) => {
    e.preventDefault();

    // Validate inputs
    if (!username || !password) {
      setError("Please enter both username and password");
      return;
    }

    // Check credentials
    if (username === predefinedUsername && password === predefinedPassword) {
      onLogin(); // Successful login
      setError(""); // Clear error message
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="login-container">
      {/* Header Title */}
      <h1 className="header-title">Real-Time Sensor Monitoring</h1>

      {/* Logo */}
      <img src="/logo.png" alt="Logo" className="login-logo" />
      
      {/* Title */}
      <h2>InnoVault</h2>
      <h3>Login</h3>

      {/* Form */}
      <form onSubmit={handleLogin}>
        <div className="input-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;