import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";
import "../styles/Login.css";
import toast from 'react-hot-toast';

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  async function loginUser(event) {

    try {
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
  
      if (response?.status === 200) {
        const accessToken = response?.data?.data?.accessToken;
        const userId = response?.data?.data?.userId;
        setAuth({ accessToken, userId });
        navigate("/");
      }
    } catch (error) {
      if (error.response?.status === 400) {
        toast.error(error.response?.data?.message);
      } else {
        toast.error("Server error");
      }
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
            <input className="login-form-submit" type="submit" value={"Login"}></input>

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
