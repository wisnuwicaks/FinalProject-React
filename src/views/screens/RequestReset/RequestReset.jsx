import React from "react";
import { Link, Redirect } from "react-router-dom";
import { API_URL } from "../../../constants/API";
import Axios from "axios";
import { connect } from "react-redux";
import "./RequestReset.css";
import {
  registerHandler,
  loginHandler,
  logoutHandler,
  cartUpdate,
  onCategoryChange,
} from "../../../redux/actions";

import {
  Col,
  Form,
  FormGroup,
  InputGroup,
  Button,
  Navbar,
  FormControl,
  Card,
} from "react-bootstrap";
import swal from "sweetalert";

class RequestReset extends React.Component {
  state = {
    emailForm: {
      email: "",
    },
  };

  inputHandler = (e, field, form) => {
    const { value } = e.target;
    this.setState({
      [form]: {
        ...this.state[form],
        [field]: value,
      },
    });
  };

  requestResetBtnHandler = () => {
    const { emailForm } = this.state;
    console.log(emailForm);
    Axios.post(`${API_URL}/users/recoverypassword`, emailForm)
      .then((res) => {
        swal(
            "Request Success",
            "Check your email to reset your password",
            "success"
          );
        console.log(res.data);
      })
      .catch((err) => {
        swal(
            "Request Failed",
            "Your email not registered",
            "error"
          );
        console.log(err);
      });
  };

  
  render() {
    return (
      <>
        <div className="container mt-4 ">
          <div className="d-flex align-items-center justify-content-center">
            <Card className="w-30 text-center p-4">
                
              <h5>ENTER YOUR EMAIL</h5>
              <p className="small text-left">
                Reset link will be sent to your email
              </p>
              <Form.Control 
              onChange={(e)=>this.inputHandler(e,"email", "emailForm")}
              className="my-2" placeholder="Enter Email" />
              <Button 
              onClick={this.requestResetBtnHandler}
              className="btn btn-danger mt-2">REQUEST RESET</Button>
            </Card>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    search: state.searchInput,
  };
};
const mapDispatchToProps = {
  onLogin: loginHandler,
  onRegister: registerHandler,
  onLogout: logoutHandler,
  cartUpdate,
  onCategoryChange,
};

export default connect(mapStateToProps, mapDispatchToProps)(RequestReset);
