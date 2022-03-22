import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
function Register() {
  const [displayname, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  //const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function registerUser(event) {
    event.preventDefault();
    console.log("register fired");
    const response = await fetch("http://localhost:5000/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        displayname,
        username,
        password,
      }),
    });

    const data = await response.json();
    if (data.status === "success") {
      //localStorage.setItem("token", data.data.token);
      navigate("/login");
    } else if (data.status === "fail") {
      alert("User error: " + data.data.user);
    } else {
      alert("Server error: " + data.message);
    }
  }

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={registerUser}>
        <input
          value={displayname}
          onChange={(e) => setDisplayName(e.target.value)}
          type="text"
          placeholder="Name"
          name="name"
        />
        <br />
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          type="text"
          placeholder="Username"
          name="username"
        />
        {/* <br />
         <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Email"
          name="email"
        /> */}
        <br />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
          name="password"
        />
        <br />
        <input type="submit" value="Register" />
      </form>
    </div>
  );
}

export default Register;