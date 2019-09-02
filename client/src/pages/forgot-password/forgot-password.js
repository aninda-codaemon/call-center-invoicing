import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/img/logo.png";
import { Button } from "react-bootstrap";
import Input from "../../components/input/input";
import validate from "../../validation-rules/login-form-validation-rules";
import useForm from "../../custom-hooks/form-validation";

function ForgotPassword() {
  const { values, errors, handleChange, handleSubmit } = useForm(
    forgotPassword,
    validate
  );

  function forgotPassword() {
    console.log("No errors, submit callback called!");
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
            </fieldset>
            <Button variant="danger" type="submit">
              Reset Password
            </Button>
          </form>
          <p className="forgot-password"><Link to="/">Login</Link></p>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
