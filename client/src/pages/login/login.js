import React, { useState } from "react";
import "./login.scss";
import logo from "../../assets/img/logo.png";
import { Button } from "react-bootstrap";

function Login() {
  const initialLoginData = {
    email: "",
    password: ""
  };

  const [loginData, setLoginData] = useState(initialLoginData);

  const handleChange = e => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    console.log(loginData);
    setLoginData(initialLoginData);
  };

  return (
    <div className="login-wrap">
      <div className="login-area">
        <figure className="logo">
          <img src={logo} alt="logo" />
          <figcaption>Roadside Assistance</figcaption>
        </figure>
        <div className="login-form-area">
          <form onSubmit={handleSubmit}>
            <fieldset>
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="float-input"
                  value={loginData.email}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="email">Email*</label>
              </div>
              <div className="form-group">
                <input
                  type="password"
                  name="password"
                  id="password"
                  className="float-input"
                  value={loginData.password}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="password">Password*</label>
              </div>
            </fieldset>
            <Button variant="danger" type="submit">
              SIGN IN
            </Button>
          </form>
          <p className="forgot-password">Forgot Password?</p>
        </div>
      </div>
    </div>
  );
}

export default Login;
