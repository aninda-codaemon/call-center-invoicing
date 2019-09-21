import React, {useState, useContext, useEffect} from "react";
import "../create-new-user/create-new-user.scss";
import Header from "../../components/header/header";
import Sidebar from "../../components/sidebar/sidebar";
import { Row, Col, Button, Container } from "react-bootstrap";
import Input from "../../components/input/input";
// import validate from "../../validation-rules/create-new-user-validation-rules";
// import useForm from "../../custom-hooks/form-validation";
import useForm from "../form-logic/user-form-logic";
import EditUserForm from './edit-form';

import UserContext from '../../context/user/userContext';

function EditUser(props) {
  const user_id = props.match.params.id;
  const userContext = useContext(UserContext);

  const { error, success, user } = userContext;
  
  const showForm = () => {
    return (
      <EditUserForm userId={user_id} />
    );
  }

  useEffect(() => {    
    userContext.info_user(user_id);
  }, []);
  
  return (
    <React.Fragment>
      <Header />
      <Container fluid={true} className="content-area">
        <Row className="main-content">
          <Col md={3} className="align-self-stretch">
            <Sidebar />
          </Col>
          <Col md={9} className="right-part">
            { user.first_name !== '' ? showForm() : 'Loading...' }
          </Col>
        </Row>
      </Container>
    </React.Fragment>
  );
}

export default EditUser;
