import React from "react";
import { Link } from "react-router-dom";
import "./login.scss";
import logo from "../../assets/img/logo.png";
import { Button } from "react-bootstrap";
import Input from "../../components/input/input";
import { withFormik } from 'formik';
import * as yup from 'yup';

const LoginForm = (props) => {
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

              <Input
                type="password"
                name="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                label="Password*"
              />
               {errors.password && touched.password && <p className="error-text">{errors.password}</p>}
            </fieldset>
            <Link to="/all-purchase-orders">
            <Button variant="danger" type="button">
              SIGN IN
            </Button>
            </Link>
            
          </form>
          <p className="forgot-password">
            <Link to="/forgot-password">Forgot Password?</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const Login = withFormik({
  mapPropsToValues: () => ({ email: '', password: '' }),
  validationSchema:yup.object().shape({
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup.string().min(5, 'Password must be at least 5 characters long').required('Password is required')
  }),
  handleSubmit(values, {resetForm}){
    console.log(values);
    // props.history.push('/all-purchase-orders');
    resetForm();
  }
})(LoginForm);

export default Login;
