import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";
import "../styles/Login.css";
const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  async function loginUser(event) {
    event.preventDefault();

    const response = await axios.post(
      "/api/login",
      JSON.stringify({
        username,
        password,
      }),
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );

    if (response?.data?.status === "success") {
      const accessToken = response?.data?.data?.accessToken;
      const userId = response?.data?.data?.userId;
      setAuth({ accessToken, userId });
      navigate("/");
    } else if (response?.data?.status === "fail") {
      alert("User error");
    } else {
      alert("Server error");
    }
  }

  return (
    <div className="login">
      <div className="login-container">
        <div className="login-form-container">
          <form className="login-form" onSubmit={loginUser}>
            <span className="login-form-title">Log In</span>
            <div className="login-form-field">
              <input
                value={username}
                className="login-form-input"
                type="text"
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
              />
            </div>
            <div className="login-form-field">
              <input
                className="login-form-input"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type="password"
                placeholder="Password"
              />
            </div>
            <input className="login-form-submit" type="submit"></input>

            <div className="register-now-container">
              <span className="no-account-text">Don’t have an account?</span>
              <a href="/register" className="register-now-text">
                Sign up now
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
