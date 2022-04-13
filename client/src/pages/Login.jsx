import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";
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
    <div>
      <h1>Login</h1>
      <form onSubmit={loginUser}>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          type="text"
          placeholder="username"
        />
        <br />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
        />
        <br />
        <input type="submit" value="Login" />
      </form>
    </div>
  );
};

export default Login;
