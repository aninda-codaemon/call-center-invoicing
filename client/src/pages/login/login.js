import React, { useState } from "react";
import "./login.scss";
import logo from "../../assets/img/logo.png";
import { Button } from "react-bootstrap";
import Input from "../../components/input/input";

function Login({history}) {
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
              <Input
                type="email"
                name="email"
                value={loginData.email}
                onChange={handleChange}
                required={true}
                label="Email*"
              />
              <Input
                type="password"
                name="password"
                value={loginData.password}
                onChange={handleChange}
                required={true}
                label="Password*"
              />
            </fieldset>
            <Button variant="danger" type="button" onClick={() => history.push("/all-purchase-orders")}>
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
