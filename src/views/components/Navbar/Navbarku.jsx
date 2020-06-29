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
import "./Navbarku.css";
import ButtonUI from "../Button/Button";
import {
  loginHandler,
  logoutHandler,
  onSearchInput,
  cartUpdate,
  onCategoryChange
} from "../../../redux/actions";
import { API_URL } from "../../../constants/API";

const CircleBg = ({ children }) => {
  return <div className="circle-bg">{children}</div>;
};

class Navbarku extends React.Component {
  state = {
    loginForm: {
      username: "",
      password: "",
      showPassword: false,
    },
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
    })
  };
  loginBtnHandler = () => {
    const { username, password } = this.state.loginForm;
    let newUser = {
      username,
      password,
    };

    this.props.onLogin(newUser);
    this.setState({modalOpen:!this.state.modalOpen})
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
    alert("asds")
  };

  toggleDropdown = () => {
    this.setState({ dropdownOpen: !this.state.dropdownOpen });
  };

  toggleModal = () => {
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
                    <FontAwesomeIcon
                      icon={faUserCircle}
                      style={{ fontSize: 20 }}
                    />
                    <p className="medium ml-3 mr-4">
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
                            onClick={()=>this.logoutBtnHandler()}
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
                          onClick={()=>this.logoutBtnHandler()}
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

                <label onClick={() => this.toggleModal()} className="hoverLink">
                  Login
                </label>

                {" | "}
                <Link id="oke" style={{ color: "inherit" }} to="/auth">
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
                  onClick={()=>this.props.onCategoryChange("Men")}
                >
                  MEN
                </Link>
              </div>

              <div className="cat-text" onClick={()=>this.props.onCategoryChange("Women")}>
                <Link
                  style={{ textDecoration: "none", color: "inherit" }}
                  to="/allproduct"
                  
                >
                  WOMEN 
                </Link>
              </div>

              <div className="cat-text">
                <Link
                  style={{ textDecoration: "none", color: "inherit" }}
                  to="/allproduct"
                  onClick={()=>this.props.onCategoryChange("")}
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

          

              <div className="col-8">
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

              <div style={{ flex: "0" }} className="">
                <Link
                  className="d-flex flex-column justify-content-center pl-2"
                  to="/cart"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div
                    style={{ justifyContent: "flex-end" }}
                    className="d-flex"
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
                    className="mr-2"
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
              <h3>Login</h3>
            </div>
          </ModalHeader>
          <ModalBody>
            <div className="row">
              <Form className="w-100 px-4">
                <Form.Group>
                  <Form.Label>Email/Username</Form.Label>
                  <Form.Control 
                  value={this.state.loginForm.username}
                  onChange={(e) => this.inputHandler(e, "username", "loginForm")}
                  placeholder="Enter email or username" />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Password</Form.Label>
                  <Form.Control 
                  value={this.state.loginForm.password}
                  onChange={(e) => this.inputHandler(e, "password", "loginForm")}
                  placeholder=" Enter password" />
                </Form.Group>
                <Form.Group>
                  <Form.Check type="checkbox" label="Show Password" />
                </Form.Group>
              </Form>
              <div className="col-12 text-center" >
                <Button onClick={this.loginBtnHandler} variant="danger" className="btnStrapCustom">Login</Button>
                </div>
            </div>
          </ModalBody>
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
  onLogin : loginHandler,
  onLogout: logoutHandler,
  onSearchInput,
  cartUpdate,
  onCategoryChange
};

export default connect(mapStateToProps, mapDispatchToProps)(Navbarku);
