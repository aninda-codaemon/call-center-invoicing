import React from "react";
import "./footer.scss";
import { Container, Row, Col } from "react-bootstrap";

const Footer = () => {
    return (
            <footer className="footer-section">
            <Container fluid={true}>
                <Row>
                     <Col xs={12}>
                         <p className="text-white text-center">Copyright © 2018-2020</p>
                    </Col>
                </Row>
            </Container>
            </footer>
    )
};
export default Footer;