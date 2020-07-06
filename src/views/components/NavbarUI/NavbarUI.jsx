import React from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import Cookies from "universal-cookie";
import Axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingCart,
  faCartPlus,
  faSignInAlt,
  faBorderAll,
  faSearch,
} from "@fortawesome/free-solid-svg-icons/";
import {
  Dropdown,
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";

import {
  Col,
  Form,
  FormGroup,
  InputGroup,
  Button,
  Navbar,
  FormControl,
} from "react-bootstrap";

import "bootstrap/dist/css/bootstrap.css";
import { faUser, faUserCircle } from "@fortawesome/free-regular-svg-icons";
import TextField from "../TextField/TextField";
import "./NavbarUI.css";
import ButtonUI from "../ButtonUI/ButtonUI";
import {
  registerHandler,
  loginHandler,
  logoutHandler,
  onSearchInput,
  cartUpdate,
  onCategoryChange,
} from "../../../redux/actions";
import { API_URL } from "../../../constants/API";

const CircleBg = ({ children }) => {
  return <div className="circle-bg">{children}</div>;
};

class NavbarUI extends React.Component {
  state = {
    loginForm: {
      username: "",
      password: "",
      showPassword: "text",
    },
    registerForm: {
      fullName: "",
      email: "",
      username: "",
      password: "",
      showPassword: false,
    },
    modalActive: "Login",
    searchBarIsFocused: false,
    searchBarInput: "",
    dropdownOpen: false,
    modalOpen: false,
  };

  componentDidUpdate() {
    if (this.props.user.id) {
      const cookie = new Cookies();
      cookie.set("authData", JSON.stringify(this.props.user), { path: "/" });
    }
  }
  searcBarInputHandler = (e) => {
    const { searchBarInput } = this.state;
    const { value } = e.target;
    this.setState({ searchBarInput: value });
    this.props.onSearchInput(searchBarInput);
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
  loginBtnHandler = () => {
    const { username, password } = this.state.loginForm;
    let newUserLogin = {
      username,
      password,
    };

    this.props.onLogin(newUserLogin);
    this.setState({ modalOpen: !this.state.modalOpen });
  };

  registerBtnHandler = () => {
    const { fullName, email, username, password } = this.state.registerForm;
    let newUserRegis = {
      fullName,
      email,
      username,
      password,
    };

    this.props.onRegister(newUserRegis);
    this.setState({ modalOpen: !this.state.modalOpen });
  };

  onFocus = () => {
    this.setState({ searchBarIsFocused: true });
  };

  onBlur = () => {
    this.setState({ searchBarIsFocused: false });
  };

  logoutBtnHandler = () => {
    this.props.onLogout();
    return <Redirect to="/" />;
  };

  showPasswordState = (e) => {
    const { checked } = e.target;
    if (checked) {
      this.setState({ showPassword: "text" });
    } else {
      this.setState({ showPassword: "password" });
    }
  };

  forgetPassword = () => {
    this.setState({ modalOpen: !this.state.modalOpen });
  };

  toggleDropdown = () => {
    this.setState({ dropdownOpen: !this.state.dropdownOpen });
  };

  toggleModal = (whichActive) => {
    this.setState({ modalActive: whichActive });
    this.setState({ modalOpen: !this.state.modalOpen });
  };

  render() {
    return (
      <div className="sticky-top ">
        <div className="d-flex justify-content-end navbar-container-black px-5">
          <div className="login-text py-1">
            {this.props.user.id ? (
              <>
                <Dropdown
                  toggle={this.toggleDropdown}
                  isOpen={this.state.dropdownOpen}
                >
                  <DropdownToggle tag="div" className="d-flex" color="white">
                    <img
                      src={
                        this.props.user.profilePicture
                          ? this.props.user.profilePicture
                          : "http://localhost:8080/file/download/default_profile_picture.png"
                      }
                      width="25px"
                      alt=""
                    />
                    <p className="medium ml-1 mr-4">
                      {this.props.user.username}
                    </p>
                  </DropdownToggle>
                  <DropdownMenu className="mt-2">
                    {this.props.user.role == "admin" ? (
                      <>
                        <DropdownItem>
                          <Link
                            style={{ color: "inherit", textDecoration: "none" }}
                            to="/admin/dashboard"
                          >
                            Dashboard
                          </Link>
                        </DropdownItem>
                        <DropdownItem>
                          <Link
                            style={{ color: "inherit", textDecoration: "none" }}
                            to="/member"
                          >
                            Members
                          </Link>
                        </DropdownItem>
                        <DropdownItem>
                          <Link
                            style={{ color: "inherit", textDecoration: "none" }}
                            to="/payment"
                          >
                            Payments
                          </Link>
                        </DropdownItem>

                        <DropdownItem>
                          <Link
                            style={{ color: "inherit", textDecoration: "none" }}
                            to="/report"
                          >
                            Report
                          </Link>
                        </DropdownItem>

                        <DropdownItem className="text-center ">
                          <Link to="/">
                            <Button
                              type="button"
                              className="btn btn-danger"
                              onClick={() => this.logoutBtnHandler()}
                            >
                              Logout
                            </Button>
                          </Link>
                        </DropdownItem>
                      </>
                    ) : (
                      <>
                        <DropdownItem>
                          <Link
                            style={{ color: "inherit", textDecoration: "none" }}
                            to="/userprofile"
                          >
                            User Profile
                          </Link>
                        </DropdownItem>
                        <DropdownItem>
                          <Link
                            style={{ color: "inherit", textDecoration: "none" }}
                            to="/history"
                          >
                            History
                          </Link>
                        </DropdownItem>

                        <DropdownItem>
                          <Link
                            style={{ color: "inherit", textDecoration: "none" }}
                            to="/wishlist"
                          >
                            Wishlist
                          </Link>
                        </DropdownItem>

                        <DropdownItem
                          onClick={() => this.logoutBtnHandler()}
                          className="text-center "
                        >
                          <Link to="/">
                            <Button type="button" className="btn btn-danger">
                              Logout
                            </Button>
                          </Link>
                        </DropdownItem>
                      </>
                    )}
                  </DropdownMenu>
                </Dropdown>
              </>
            ) : (
              <>
                <FontAwesomeIcon
                  className="mr-2"
                  icon={faSignInAlt}
                  style={{ fontSize: 20, color: "white" }}
                />

                <label
                  onClick={() => this.toggleModal("Login")}
                  className="hoverLink"
                >
                  Login
                </label>

                {" | "}
                <Link
                  id="oke"
                  style={{ color: "inherit" }}
                  onClick={() => this.toggleModal("Register")}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
        <div className="navbar-container border-bot px-5">
          <Navbar expand="lg" className="p-0">
            <Navbar.Brand href="#home" className="">
              <div className="logo-text fontLogo">
                <Link
                  id="oke"
                  style={{ textDecoration: "none", color: "inherit" }}
                  to="/"
                >
                  {/* <img src="https://i.ibb.co/ssCQKFm/white-logo.png" width="100px" alt=""/> */}
                  NEW S
                </Link>
              </div>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav" className="p-0">
              <div className="cat-text">
                <Link
                  style={{ textDecoration: "none", color: "inherit" }}
                  to="/allproduct"
                  onClick={() => this.props.onCategoryChange("Men")}
                >
                  MEN
                </Link>
              </div>

              <div
                className="cat-text"
                onClick={() => this.props.onCategoryChange("Women")}
              >
                <Link
                  style={{ textDecoration: "none", color: "inherit" }}
                  to="/allproduct"
                >
                  WOMEN
                </Link>
              </div>

              <div
                className="cat-text"
                onClick={() => this.props.onCategoryChange("Accessories")}
              >
                <Link
                  style={{ textDecoration: "none", color: "inherit" }}
                  to="/allproduct"
                >
                  ACCESSORIES
                </Link>
              </div>

              <div className="cat-text">
                <Link
                  style={{ textDecoration: "none", color: "inherit" }}
                  to="/allproduct"
                  onClick={() => this.props.onCategoryChange("")}
                >
                  ALL PRODUCT
                </Link>
              </div>
              <div className="cat-text">
                <Link
                  style={{ textDecoration: "none", color: "inherit" }}
                  to="/"
                >
                  NEW COLLECTION
                </Link>
              </div>

              <div className="col">
                <Form inline className="">
                  <InputGroup className="w-100">
                    <FormControl
                      textDecoration="inherit"
                      className=""
                      placeholder="Find your product"
                      aria-label="search  "
                      aria-describedby="basic-addon1"
                    />
                    <InputGroup.Append>
                      <Button
                        type="button"
                        className="btn btn-dark"
                        onClick={() => alert("asd")}
                      >
                        <FontAwesomeIcon
                          icon={faSearch}
                          style={{ fontSize: 15, color: "white" }}
                        ></FontAwesomeIcon>
                      </Button>
                    </InputGroup.Append>
                  </InputGroup>
                </Form>
              </div>

              <div style={{ flex: "0" }} className="p-1">
                <Link
                  className="d-flex flex-column justify-content-center"
                  to="/cart"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div
                  // style={{ justifyContent: "" }}
                  // className="d-flex"
                  >
                    <CircleBg>
                      <small
                        className="pt-2"
                        style={{
                          color: "black",
                          fontWeight: "bold",
                          fontSize: "15px",
                        }}
                      >
                        <div className="p-1">
                          {this.props.user.cartItemsCount}
                        </div>
                      </small>
                    </CircleBg>
                  </div>
                  <FontAwesomeIcon
                    className=""
                    icon={faCartPlus}
                    style={{ fontSize: 30, color: "white" }}
                  />
                </Link>
              </div>
            </Navbar.Collapse>
          </Navbar>
        </div>

        <Modal
          toggle={this.toggleModal}
          isOpen={this.state.modalOpen}
          className="edit-modal"
          centered
        >
          <ModalHeader toggle={this.toggleModal}>
            <div className="text-center justify-content-center">
              {this.state.modalActive == "Login" ? (
                <h3>Login</h3>
              ) : (
                <h3>Register</h3>
              )}
            </div>
          </ModalHeader>
          {this.state.modalActive == "Login" ? (
            <ModalBody>
              <div className="row">
                <Form className="w-100 px-4">
                  <Form.Group>
                    <Form.Label>Email/Username</Form.Label>
                    <Form.Control
                      value={this.state.loginForm.username}
                      onChange={(e) =>
                        this.inputHandler(e, "username", "loginForm")
                      }
                      placeholder="Enter email or username"
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type={this.state.showPassword}
                      value={this.state.loginForm.password}
                      onChange={(e) =>
                        this.inputHandler(e, "password", "loginForm")
                      }
                      placeholder=" Enter password"
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Check
                      type="checkbox"
                      label="Show Password"
                      onClick={(e) => this.showPasswordState(e)}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Link
                      to="/request_reset"
                      onClick={() => this.forgetPassword()}
                    >
                      Forget Password
                    </Link>
                  </Form.Group>
                </Form>
                <div className="col-12 text-center">
                  <Button
                    onClick={this.loginBtnHandler}
                    variant="danger"
                    className="btnStrapCustom"
                  >
                    Login
                  </Button>
                </div>
              </div>
            </ModalBody>
          ) : (
            <ModalBody>
              <div className="row">
                <Form className="w-100 px-4">
                  <Form.Group>
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                      value={this.state.registerForm.fullName}
                      onChange={(e) =>
                        this.inputHandler(e, "fullName", "registerForm")
                      }
                      placeholder="Enter Full Name"
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      value={this.state.registerForm.email}
                      onChange={(e) =>
                        this.inputHandler(e, "email", "registerForm")
                      }
                      placeholder="Enter email"
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      value={this.state.registerForm.username}
                      onChange={(e) =>
                        this.inputHandler(e, "username", "registerForm")
                      }
                      placeholder="Enter username"
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      value={this.state.registerForm.password}
                      onChange={(e) =>
                        this.inputHandler(e, "password", "registerForm")
                      }
                      placeholder=" Enter password"
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Check type="checkbox" label="Show Password" />
                  </Form.Group>
                </Form>
                <div className="col-12 text-center">
                  <Button
                    onClick={this.registerBtnHandler}
                    variant="danger"
                    className="btnStrapCustom"
                  >
                    Register
                  </Button>
                </div>
              </div>
            </ModalBody>
          )}
        </Modal>
      </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(NavbarUI);
