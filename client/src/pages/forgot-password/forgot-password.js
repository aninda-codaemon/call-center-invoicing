import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/img/logo.png";
import { Button } from "react-bootstrap";
import Input from "../../components/input/input";
import { withFormik } from 'formik';
import * as yup from 'yup';

const ForgotPasswordForm = (props) => {
  const {
    values,
    touched,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
  } = props;

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
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                label="Email*"
              />
              {errors.email && touched.email && <p className="error-text">{errors.email}</p>}
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

const ForgotPassword = withFormik({
  mapPropsToValues: () => ({ email: ''}),
  validationSchema:yup.object().shape({
    email: yup.string().email('Invalid email').required('Email is required')
  }),
  handleSubmit(values, {resetForm}){
    console.log(values);
    resetForm();
  }
})(ForgotPasswordForm);

export default ForgotPassword;
