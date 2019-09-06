import React from "react";
import { Link } from "react-router-dom";
import "./login.scss";
import logo from "../../assets/img/logo.png";
import { Button } from "react-bootstrap";
import Input from "../../components/input/input";
import useForm from "../form-logic/form-logic";

const Login = () => {
  const initialValues = {
    email: "",
    password: ""
  };

  const submitedSuccessfully = () => {
    console.log("No error found, submitted successfully.")
  };

  const { handleChange, values, touched, handleBlur, validator, handleSubmit } = useForm(
    initialValues,
    submitedSuccessfully
  );

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
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                label="Email*"
              />
              {validator.message("email", values.email, "required|email")}
              {touched.email && validator.errorMessages.email && (
                <p className="error-text">{validator.errorMessages.email}</p>
              )}
              <Input
                type="password"
                name="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                label="Password*"
              />
              {validator.message("password", values.password, "required")}
              {touched.password && validator.errorMessages.password && (
                <p className="error-text">{validator.errorMessages.password}</p>
              )}
            </fieldset>
            <Link to="/all-purchase-orders">
              <Button variant="danger" type="submit">
                SIGN IN
              </Button>
            </Link>
            {/* <Button variant="danger" type="submit">
              SIGN IN
            </Button> */}
          </form>
          <p className="forgot-password">
            <Link to="/forgot-password">Forgot Password?</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
