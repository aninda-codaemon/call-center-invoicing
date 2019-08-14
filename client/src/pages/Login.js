import React, { useState } from "react";
import logo from "./../assets/img/logo.png";

function Login() {
  const initialData = {
    email: "",
    password: ""
  };

  const [loginData, setLoginData] = useState(initialData);

  const handleChange = e => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    console.log(loginData);
    setLoginData(initialData);
  };

  return (
    <div className="login-bg">
      <div className="container">
        <div className="row">
          <div className="col-sm-6 col-sm-offset-3 col-md-4 col-md-offset-4 login-form-cont text-center">
            <a >
              <img src={logo} alt="Roadside Assistance" className="logo" />
            </a>
            <h1 className="logo-text">Roadside Assistance</h1>
            <form className="row form-cont" onSubmit={handleSubmit}>
              <div className="custom-input">
                <div className="group">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={loginData.email}
                    onChange={handleChange}
                    required
                  />
                  <label htmlFor="email">Email</label>
                </div>
              </div>
              <div className="custom-input">
                <div className="group">
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={loginData.password}
                    onChange={handleChange}
                    required
                  />
                  <label htmlFor="password">Password</label>
                </div>
              </div>
              <button className="btn primary-btn" type="submit">
                Sign In
              </button>
              <a className="forgot-pw">
                Forgot Password?
              </a>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
