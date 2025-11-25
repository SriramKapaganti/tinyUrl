import React, { useState } from "react";
import "./auth.css";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [userCredentials, setUserCred] = useState({
    email: "",
    password: "",
  });

  const [errMessage, setErr] = useState(null);
  const navgiate = useNavigate();

  const onChangeLoginForm = (event) => {
    const { name, value } = event.target;
    setUserCred((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const callApi = async (event) => {
    event.preventDefault();

    try {
      const url = import.meta.env.VITE_BACKEND_URL;
      const response = await fetch(`${url}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(userCredentials),
      });

      const data = await response.json();

      if (!response.ok) {
        setErr(data.message);
        return;
      }

      alert("Logged in successfully!");
      setErr(null);
      navgiate("/");
      console.log(response);
    } catch (err) {
      console.log(err);
      setErr("Something went wrong");
    }
  };

  return (
    <div className="auth-container">
      <h1 className="title">TinyURL Login</h1>

      <form className="auth-form" onSubmit={callApi}>
        <label className="label">Email</label>
        <input
          type="email"
          className="input-box"
          name="email"
          onChange={onChangeLoginForm}
          required
        />

        <label className="label">Password</label>
        <input
          type="password"
          className="input-box"
          name="password"
          onChange={onChangeLoginForm}
          required
        />

        <button type="submit" className="btn">
          Login
        </button>

        <button
          type="button"
          className="btn"
          onClick={() => navgiate("/signup")}
        >
          SignUp
        </button>

        {errMessage && <p className="error">{errMessage}</p>}
      </form>
    </div>
  );
};

export default LoginForm;
