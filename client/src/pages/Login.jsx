import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
function Login() {
  // const [username, setUsername] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function loginUser(event) {
    event.preventDefault();
    const response = await fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });
    const data = await response.json();

    if (data.status === "success") {
      localStorage.setItem("token", data.data.token);
      localStorage.setItem("id", data.data.id);
      //alert("Login successful");
      navigate("/");
    } else if (data.status === "fail") {
      alert("User error: " + data.data.user);
    } else {
      alert("Server error: " + data.message);
    }
  }

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={loginUser}>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          type="username"
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
}

export default Login;
