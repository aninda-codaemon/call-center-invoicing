import React from "react";
import { Link } from "react-router-dom";
import "./login.scss";
import logo from "../../assets/img/logo.png";
import { Button } from "react-bootstrap";
import Input from "../../components/input/input";
import validate from "../../validation-rules/login-form-validation-rules";
import useForm from "../../custom-hooks/form-validation";

function Login() {
  const { values, errors, handleChange, handleSubmit } = useForm(
    login,
    validate
  );

  function login() {
    console.log(values);
  }

  return (
    <div className="login-wrap">
      <div className="login-area">
        <figure className="logo">
          <img src={logo} alt="logo" />
          <figcaption>Roadside Assistance</figcaption>
        </figure>
        <div className="login-form-area">
          <form onSubmit={handleSubmit} noValidate>
            <fieldset>
              <Input
                type="email"
                name="email"
                value={values.email || ""}
                onChange={handleChange}
                required={true}
                label="Email*"
              />
              {errors.email && <p className="error-text">{errors.email}</p>}

              <Input
                type="password"
                name="password"
                value={values.password || ""}
                onChange={handleChange}
                required={true}
                label="Password*"
              />
              {errors.password && (
                <p className="error-text">{errors.password}</p>
              )}
            </fieldset>
            <Button variant="danger" type="submit">
              SIGN IN
            </Button>
          </form>
          <p className="forgot-password">
            <Link to="/forgot-password">Forgot Password?</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
