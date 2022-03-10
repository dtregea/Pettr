import React from "react";
import Login from "../pages/Login";
import Register from "../pages/Register";
import { Navigate, useNavigate } from "react-router-dom";

function LoggedOutView() {
  const navigate = useNavigate();
  function goToLogin() {
    navigate("/login");
  }
  function goToRegister() {
    navigate("/register");
  }
  return (
    <div>
      <button onClick={goToLogin}>login</button>
      <br />
      <button onClick={goToRegister}>register</button>
    </div>
  );
}

export default LoggedOutView;
