import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import axios from "../api/axios";
function Register() {
  const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
  const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
  const [displayname, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function registerUser(event) {
    event.preventDefault();
    // if (!USER_REGEX.test(username)) {
    //   alert("Username must be 4-24 characters long and start with a letter");
    //   return;
    // }
    // if (!PWD_REGEX.test(password)) {
    //   alert(
    //     "Password must be 8-24 characters long and contain at least one number, one uppercase letter, one lowercase letter, and one special character"
    //   );
    //   return;
    // }

    const response = await axios.post(
      "/api/users",
      JSON.stringify({
        displayname,
        username,
        password,
      }),
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );

    //const data = await response.json();
    if (response?.data?.status === "success") {
      navigate("/login");
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
          <form class="login-form" onSubmit={registerUser}>
            <span class="login-form-title">Create An Account</span>
            <div class="login-form-field">
              <input
                class="login-form-input"
                value={displayname}
                onChange={(e) => setDisplayName(e.target.value)}
                type="text"
                placeholder="Name"
                name="name"
              />
            </div>
            <div class="login-form-field">
              <input
                class="login-form-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                type="text"
                placeholder="Username"
                name="username"
              />
            </div>
            <div class="login-form-field">
              <input
                class="login-form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Password"
                name="password"
              />
            </div>
            <input className="login-form-submit" type="submit"></input>

            <div class="register-now-container">
              <span class="no-account-text">Already have an account?</span>
              <a href="/login" class="register-now-text">
                Log in now
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
