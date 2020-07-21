import React from "react";
import { Link, Redirect } from "react-router-dom";
import { API_URL } from "../../../constants/API";
import Axios from "axios";
import { connect } from "react-redux";
import {
  registerHandler,
  loginHandler,
  logoutHandler,
  cartUpdate,
  onCategoryChange,
} from "../../../redux/actions";
import "./UserProfile.css";
import {
  Col,
  Form,
  FormGroup,
  InputGroup,
  Button,
  Navbar,
  FormControl,
} from "react-bootstrap";
import Table from "react-bootstrap/Table";

import ButtonUI from "../../components/ButtonUI/ButtonUI";
import swal from "sweetalert";

const defaultImageProfile = {
  backgroundImage: `url('http://localhost:8080/file/download/user_profile.png')`,

  backgroundSize: "cover",
  backgroundPosition: "center",
};
const userImageProfile = {
  backgroundImage: `url('https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500')`,

  backgroundSize: "cover",
  backgroundPosition: "center",
};

class UserProfile extends React.Component {
  state = {
    editKeyState: [],
    completeKeyData: [],
    profileTab: true,
    selectedFile: null,
    updatePasswordForm: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },

    userActive: {
      fullName: "",
      email: "",
      username: "",
      password: "",
      address: "",
    },
  };

  componentDidMount() {
    this.getUserActive();
  }
  getUserActive = () => {
    Axios.get(`${API_URL}/users/${this.props.user.id}`)

      .then((res) => {
        console.log(res.data);
        const { fullName, username, email, address } = res.data;
        this.setState({
          userActive: {
            fullName,
            email,
            username,
            address,
          },
        });
        this.setState({ completeKeyData: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
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

  fileChangeHandler = (e) => {
    this.setState({ selectedFile: e.target.files[0] });
  };

  editFieldHandler = (keyEdit) => {
    const { editKeyState } = this.state;
    this.setState({ editKeyState: [...editKeyState, keyEdit] });
  };

  saveFieldHandler = (keyEdit) => {
    const { editKeyState } = this.state;
    let tempActive = [...editKeyState];
    tempActive.splice(tempActive.indexOf(keyEdit), 1);
    this.setState({ editKeyState: tempActive });
  };

  setActiveTab = () => {
    this.setState({ profileTab: !this.state.profileTab });
  };

  postUserProfile = () => {
    const { userActive, completeKeyData } = this.state;
    let formData = new FormData();

    if (this.state.selectedFile) {
      formData.append(
        "file",
        this.state.selectedFile,
        this.state.selectedFile.name
      );

      let userData = { ...completeKeyData };

      formData.append("userData", JSON.stringify(userData));
      Axios.post(`${API_URL}/users/update_profile/photo`, formData)
        .then((res) => {
          console.log("berhasil upload res data");
          alert("berhasil");
          console.log(res.data);
          this.setState({ selectedFile: null });
          this.getUserActive();
        })
        .catch((err) => {
          alert("gagal");
          console.log(err);
        });
    }

    let userData = { ...completeKeyData, ...userActive };
    Axios.put(`${API_URL}/users/update_profile/data`, userData)
      .then((res) => {
        console.log("berhasil update res data");
        alert("berhasil");
        console.log(res.data);
        if (userActive.username !== completeKeyData.username) {
          this.props.onLogout();
          swal(
            "Your username has changed",
            "Your username has been successfully changed, please relogin",
            "success"
          );
        }
        if (userActive.email !== completeKeyData.email) {
          this.props.onLogout();
          swal(
            "Your email has changed",
            "Your email has been successfully changed, please relogin",
            "success"
          );
        }

        this.getUserActive();
      })
      .catch((err) => {
        alert("gagal");
        console.log(err);
      });
  };

  updatePasswordHandler = () => {
    const {
      oldPassword,
      newPassword,
      confirmPassword,
    } = this.state.updatePasswordForm;
    const { completeKeyData } = this.state;
    let userData = { ...completeKeyData };
    console.log(userData);

    if (newPassword == confirmPassword) {
      Axios.post(`${API_URL}/users/changepassword`, userData, {
        params: {
          oldPass: oldPassword,
          newPass: newPassword,
        },
      })
        .then((res) => {
          console.log("berhasil");
          swal(
            "Password Changed",
            "Your password has been successfully changed, please relogin",
            "success"
          );
          this.props.onLogout();
          console.log(res.data);
        })
        .catch((err) => {
          alert("GAGAL kesalahan sistem");
          console.log(err);
        });
    } else {
      alert("Password tidak cocok");
    }
  };

  renderUserProdfile = () => {
    const { userActive, editKeyState } = this.state;
    return Object.keys(userActive).map((val) => {
      return (
        <tr>
          <td>
            <caption>{val}</caption>
          </td>
          {editKeyState.includes(val) ? (
            <>
              <td>
                <Form.Control
                  as={val == "address" ? "textarea" : "input"}
                  value={userActive[val]}
                  onChange={(e) => this.inputHandler(e, val, "userActive")}
                />
              </td>
              <td>
                <Link onClick={() => this.saveFieldHandler(val)}>OK</Link>
              </td>
            </>
          ) : (
            <>
              <td>{userActive[val]}</td>
              <td>
                <Link onClick={() => this.editFieldHandler(val)}>Edit</Link>
              </td>
            </>
          )}
        </tr>
      );
    });
  };
  render() {
    const {
      oldPassword,
      newPassword,
      confirmPassword,
    } = this.state.updatePasswordForm;

    {
      if (!this.props.user.id) {
        return <Redirect to="/" />;
      } else {
        return (
          <>
            <div
              className="container justify-content-center border"
              style={{ minHeight: "650px" }}
            >
              <div className="row pt-4" style={{ minHeight: "450px" }}>
                <div className="d-flex col-3 border justify-content-center align-items-center pictureDiv">
                  <img
                    className="profilePhoto"
                    src={
                      this.props.user.profilePicture
                        ? this.props.user.profilePicture
                        : "http://localhost:8080/file/download/user_profile.png"
                    }
                  />

                  <label for="file-upload">
                    <ButtonUI className="overlayBtn">Change Photo</ButtonUI>
                  </label>
                  <input
                    style={{ display: "none" }}
                    id="file-upload"
                    type="file"
                    onChange={this.fileChangeHandler}
                  />
                </div>
                <div className="col-5 h-100">
                  <div className="d-flex">
                    <ButtonUI
                      type={this.state.profileTab ? "contained" : "outlined"}
                      onClick={this.setActiveTab}
                      className="mr-1"
                    >
                      User Profile
                    </ButtonUI>
                    <ButtonUI
                      type={this.state.profileTab ? "outlined" : "contained"}
                      onClick={this.setActiveTab}
                    >
                      Change Password
                    </ButtonUI>
                  </div>
                  {this.state.profileTab ? (
                    <>
                      <Table hover >
                        {this.renderUserProdfile()}
                        <Button onClick={this.postUserProfile}>
                          SUBMIT CHANGE
                        </Button>
                      </Table>
                    </>
                  ) : (
                    <Table>
                      <tr>
                        <td>
                          <caption>Old Password</caption>
                        </td>
                        <td>
                          <Form.Control
                            value={this.state.updatePasswordForm.oldPassword}
                            onChange={(e) =>
                              this.inputHandler(
                                e,
                                "oldPassword",
                                "updatePasswordForm"
                              )
                            }
                            placeholder="Enter Old Password"
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <caption>New Password</caption>
                        </td>
                        <td>
                          <Form.Control
                            value={this.state.updatePasswordForm.newPassword}
                            onChange={(e) =>
                              this.inputHandler(
                                e,
                                "newPassword",
                                "updatePasswordForm"
                              )
                            }
                            placeholder="Enter New Password"
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <caption>Confirm Password</caption>
                        </td>
                        <td>
                          <Form.Control
                            value={
                              this.state.updatePasswordForm.confirmPassword
                            }
                            onChange={(e) =>
                              this.inputHandler(
                                e,
                                "confirmPassword",
                                "updatePasswordForm"
                              )
                            }
                            placeholder="Confirm New Password"
                          />
                          {newPassword !== confirmPassword &&
                          confirmPassword !== "" ? (
                            <p className="small" style={{ color: "red" }}>
                              Password doesn't match
                            </p>
                          ) : null}
                        </td>
                      </tr>

                      <Button onClick={this.updatePasswordHandler}>
                        UPDATE PASSWORD
                      </Button>
                    </Table>
                  )}
                </div>
              </div>
            </div>
          </>
        );
      }
    }
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};
const mapDispatchToProps = {
  onLogin: loginHandler,
  onRegister: registerHandler,
  onLogout: logoutHandler,
  cartUpdate,
  onCategoryChange,
};

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);
