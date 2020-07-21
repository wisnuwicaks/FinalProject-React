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

class ResetPassword extends React.Component {
  state = {
    linkNotFound: false,
    isPasswordReseted :false,
    userReset: {},
    newPassword: {
      password: "",
    },
  };

  componentDidMount() {
    this.getUserActive();
  }
  getUserActive = () => {
    Axios.post(`${API_URL}/users/user_to_reset`, {
      id: this.props.match.params.user_id,
      verificationCode: this.props.match.params.reset_code,
    })

      .then((res) => {
        console.log("init rest.data" + res.data);

        this.setState({
          userReset: res.data,
        });
        console.log(this.state.userReset);
      })
      .catch((err) => {
        this.setState({ linkNotFound: true });
        console.log(err);
      });
  };

  inputHandler = (e) => {
    const { value } = e.target;
    this.setState({
      newPassword: {
        password: value,
      },
    });
  };

  updateNewPassword = () => {
    const { newPassword, userReset } = this.state;
    let userData = { ...userReset, ...newPassword };
    console.log(userData);

    Axios.put(`${API_URL}/users/resetpassword`, userData)
      .then((res) => {
        console.log("berhasil");
        swal("Request Success", "Your password has been reseted", "success");
        this.setState({ newPassword: { password: "" } });//mengosongkan input field new password
        this.setState({isPasswordReseted:true})//mengubah state jika berhasil direset, untuk masuk else if

        console.log(res.data);
      })
      .catch((err) => {
        alert("error");
        console.log(err);
      });
  };

  render() {
    if (this.state.linkNotFound) {
      alert("Link not valid");
      return <Redirect to="/" />;
    } 
    else if(this.state.isPasswordReseted){
      return <Redirect to="/" />;
    }
    else {
      return (
        <>
          <div className="container mt-4 ">
            <div className="d-flex align-items-center justify-content-center">
              <Card className="w-30 text-center p-4">
                {/* {this.state.userReset.id}
                {this.state.newPassword.password}
                {this.props.match.params.user_id}
                {this.props.match.params.reset_code}
                {this.state.userReset.email} */}
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

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword);
