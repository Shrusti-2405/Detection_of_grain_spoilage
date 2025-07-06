import React, { useState } from "react";
import SensorData from "./SensorData";
import Login from "./login";
import "./App.css";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);  
  };

  return (
    <div className="app-container">
      
      {isLoggedIn ? (
        <SensorData /> 
      ) : (
        <Login onLogin={handleLogin} /> 
      )}
    </div>
  );
};

export default App;
