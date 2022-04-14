import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";
import "../styles/Login.css";
const Login = () => {
  // const [username, setUsername] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  async function loginUser(event) {
    event.preventDefault();

    const response = await axios.post(
      "http://localhost:5000/api/login",
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
    <div class="login">
      <div class="login-container">
        <div class="login-form-container">
          <form class="login-form" onSubmit={loginUser}>
            <span class="login-form-title">Log In</span>
            <div class="login-form-field">
              <input
                value={username}
                class="login-form-input"
                type="text"
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
              />
            </div>
            <div class="login-form-field">
              <input
                class="login-form-input"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                placeholder="Password"
              />
            </div>
            <input className="login-form-submit" type="submit"></input>

            <div class="register-now-container">
              <span class="no-account-text">Don’t have an account?</span>
              <a href="/register" class="register-now-text">
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
