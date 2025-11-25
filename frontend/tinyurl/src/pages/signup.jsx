import React, { useState } from "react";
import "./auth.css";
import { useNavigate } from "react-router-dom";

const SignupForm = () => {
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errMessage, setErr] = useState(null);
  const navigate = useNavigate();
  const onChangeSignUp = (event) => {
    const { name, value } = event.target;
    setUserDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const callApi = async (event) => {
    event.preventDefault();

    try {
      const url = import.meta.env.VITE_BACKEND_URL;
      const response = await fetch(`${url}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(userDetails),
      });

      const data = await response.json();

      if (!response.ok) {
        setErr(data.message);
        return;
      }

      alert("Account created successfully!");
      setErr(null);
    } catch {
      setErr("Something went wrong");
    }
  };

  return (
    <div className="auth-container">
      <h1 className="title">Create an Account</h1>

      <form className="auth-form" onSubmit={callApi}>
        <label className="label">Name</label>
        <input
          type="text"
          className="input-box"
          name="name"
          onChange={onChangeSignUp}
          required
        />

        <label className="label">Email</label>
        <input
          type="email"
          className="input-box"
          name="email"
          onChange={onChangeSignUp}
          required
        />

        <label className="label">Password</label>
        <input
          type="password"
          className="input-box"
          name="password"
          onChange={onChangeSignUp}
          required
        />

        <button type="submit" className="btn">
          Sign Up
        </button>

        <button
          type="button"
          className="btn"
          onClick={() => navigate("/login")}
        >
          Login
        </button>

        {errMessage && <p className="error">{errMessage}</p>}
      </form>
    </div>
  );
};

export default SignupForm;
