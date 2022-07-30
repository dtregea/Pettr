import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import axios from "../api/axios";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import useAuth from "../hooks/useAuth";
import toast from 'react-hot-toast';

function Register() {
  const { setAuth } = useAuth();
  const usernameRegex = /^[a-zA-Z0-9_]{1,15}$/;
  const displayNameRegex = /^[a-zA-Z ().@$!%*#?&0-9]{1,20}$/;
  const passwordRegex =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-+()\[\]{}|/\\'":;<>~`]).{8,}$/;
  const [displayname, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordReenter, setPasswordReenter] = useState("");
  const navigate = useNavigate();
  const [validDisplayName, setValidDisplayName] = useState(false);
  const [validUsername, setValidUsername] = useState(false);
  const [validPassword, setValidPassword] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(false);

  function setAndValidate(event, regex, valueSetter, validSetter) {
    valueSetter(event.target.value);
    validSetter(regex.test(event.target.value.trim()));
    
  }

  function validateMatchPassword(event) {
    setPasswordReenter(event.target.value);
    if(password && event.target.value) {
      setPasswordsMatch(password === event.target.value);
    }
  }

  async function registerUser(event) {
    try {
      event.preventDefault();
      if (!validDisplayName || !validUsername || !validPassword || !passwordsMatch) {
        toast.error("Please fill out all fields according to the requirements")
        return;
      }

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

      if (response?.status === 200) {
        const accessToken = response?.data?.data?.accessToken;
        const userId = response?.data?.data?.userId;
        setAuth({ accessToken, userId });
        navigate("/home");
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
    <div class="login">
      <div class="login-container">
        <div class="login-form-container">
          <form class="login-form" onSubmit={registerUser}>
            <span class="login-form-title">Create An Account</span>
            <div class="login-form-field">
              <input
                class="login-form-input"
                value={displayname}
                onChange={(e) =>
                  setAndValidate(
                    e,
                    displayNameRegex,
                    setDisplayName,
                    setValidDisplayName
                  )
                }
                type="text"
                placeholder="Name"
                name="name"
              />
            </div>
            <div class="login-form-field">
              <input
                class="login-form-input"
                value={username}
                onChange={(e) =>
                  setAndValidate(
                    e,
                    usernameRegex,
                    setUsername,
                    setValidUsername
                  )
                }
                type="text"
                placeholder="Username"
                name="username"
              />
            </div>
            <div class="login-form-field">
              <input
                class="login-form-input"
                value={password}
                onChange={(e) =>
                  setAndValidate(
                    e,
                    passwordRegex,
                    setPassword,
                    setValidPassword
                  )
                }
                type="password"
                placeholder="Password"
                name="password"
              />
            </div>
            <div class="login-form-field">
              <input
                class="login-form-input"
                value={passwordReenter}
                onChange={(e) =>
                  validateMatchPassword(e)
                }
                type="password"
                placeholder="Re-enter Password"
              />
            </div>
            <input className="login-form-submit" type="submit" value={"Sign Up"} />

            <div className="validation-container">
              <div
                className={`${validDisplayName ? "valid" : "invalid"} check`}
              >
                {" "}
                <div>
                  <CheckCircleIcon fontSize="small" />
                </div>
                <div>Name is 1-20 characters</div>
              </div>
              <div className={`${validUsername ? "valid" : "invalid"} check`}>
                <CheckCircleIcon fontSize="small" /> Username is 1-15 characters
                containing only letters, numbers, or underscores
              </div>
              <div className={`${validPassword ? "valid" : "invalid"} check`}>
                <CheckCircleIcon fontSize="small" /> Password is at least 8 characters
                containing at least one capital letter, number and special character
              </div>
              <div className={`${passwordsMatch ? "valid" : "invalid"} check`}>
                <CheckCircleIcon fontSize="small" /> Passwords match
              </div>
            </div>
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
