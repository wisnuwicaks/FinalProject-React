import React from "react";
import { Link, Redirect } from "react-router-dom";
import { API_URL } from "../../../constants/API";
import Axios from "axios";
import { connect } from "react-redux";
import {
  registerHandler,
  loginHandler,
  logoutHandler,
  onSearchInput,
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
    },
  };

  componentDidMount() {
    this.getUserActive();
  }
  getUserActive = () => {
    Axios.get(`${API_URL}/users/${this.props.user.id}`)

      .then((res) => {
        console.log(res.data);
        this.setState({
          userActive: {
            ["fullName"]: res.data.fullName,
            ["email"]: res.data.email,
            ["username"]: res.data.username,
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
    let userData = { ...completeKeyData, ...userActive };
    Axios.put(`${API_URL}/users/updateprofile`, userData)
      .then((res) => {
        console.log("berhasil");
        alert("berhasil");
        console.log(res.data);
      })
      .catch((err) => {
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
            <div className="container mt-4 justify-content-center">
              <div className="row" style={{ height: "400px" }}>
                <div
                  // style={this.props.user.profilePicture? null:defaultImageProfile}
                  className="d-flex col-3 border justify-content-center align-items-center pictureDiv"
                >
                  <img
                    className="profilePhoto"
                    src={
                      this.props.user.profilePicture
                        ? this.props.user.profilePicture
                        : "http://localhost:8080/file/download/user_profile.png"
                    }
                  />
                  <input type="file" name="" id=""/>
                  <ButtonUI className="btnHide" onClick={alert("asd")}>Change Photo</ButtonUI>
                </div>
                <div className="col">
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
                      <table>
                        {this.renderUserProdfile()}
                        <Button onClick={this.postUserProfile}>
                          SUBMIT CHANGE
                        </Button>
                      </table>
                    </>
                  ) : (
                    <table>
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
                    </table>
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

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);
