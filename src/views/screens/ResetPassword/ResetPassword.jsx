import React from "react";
import { Link, Redirect } from "react-router-dom";
import { API_URL } from "../../../constants/API";
import Axios from "axios";
import { connect } from "react-redux";
import "./ResetPassword.css";
import {
  registerHandler,
  loginHandler,
  logoutHandler,
  onSearchInput,
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

class ForgetPassword extends React.Component {
  state = {
    userReset: {},
    newPassword: {
      password : "",
    },
  };

  componentDidMount() {
    this.getUserActive();
  }
  getUserActive = () => {
    Axios.get(`${API_URL}/users/${this.props.match.params.user_id}`)

      .then((res) => {
        console.log(res.data);
        this.setState({
          userReset: res.data,
        });
        console.log(this.state.userReset);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  inputHandler = (e) => {
    const { value } = e.target;
    this.setState({
      newPassword :{
        "password": value
      }
      ,
    });
  };

  updateNewPassword = () => {
    const { newPassword, userReset } = this.state;
    let userData = { ...userReset, ...newPassword };
    console.log(userData);
    
    Axios.put(`${API_URL}/users/resetpassword`, userData)
      .then((res) => {
        console.log("berhasil");
        swal(
          "Request Success",
          "Your password has been reseted",
          "success"
        );
        this.setState({newPassword:{"password":""}})
        console.log(res.data);
      })
      .catch((err) => {
        alert("error");
        console.log(err);
      });
  };

  render() {
    return (
      <>
        <div className="container mt-4 ">
          <div className="d-flex align-items-center justify-content-center">
            <Card className="w-30 text-center p-4">
              {this.state.newPassword.password}
              {this.props.match.params.user_id}
              {this.state.userReset.email}
              <h5>ENTER YOUR NEW PASSWORD</h5>
              <Form.Control
                className="my-2"
                placeholder="Enter New Password"
                value={this.state.newPassword.password}
                onChange={(e) => this.inputHandler(e)}
              />
              <Form.Check
                className="text-left my-2"
                type="checkbox"
                label="Show Password"
              />
              <Button
                onClick={this.updateNewPassword}
                className="btn btn-danger mt-2"
              >
                RESET PASSWORD
              </Button>
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
  onSearchInput,
  cartUpdate,
  onCategoryChange,
};

export default connect(mapStateToProps, mapDispatchToProps)(ForgetPassword);
