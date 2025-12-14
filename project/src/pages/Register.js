import React from 'react'

import "./Register.css";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const handleRegister = () => {
    // mock register success
    navigate("/");
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Sign up to get started</p>
        </div>
        
        <div className="auth-form">
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              placeholder="Choose a username"
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Create a password"
            />
          </div>
          
          <button className="auth-button" onClick={handleRegister}>
            Sign Up
          </button>
        </div>
        
        <div className="auth-footer">
          <p>
            Already have an account?{" "}
            <Link to="/" className="auth-link">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;

