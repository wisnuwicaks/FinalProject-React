import React from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import Axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingCart,
  faCartPlus,
  faSignInAlt,
  faBorderAll,
} from "@fortawesome/free-solid-svg-icons/";
import {
  Dropdown,
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
  Container,
  Row,
  Col,
  Collapse,
  UncontrolledPopover,
  PopoverHeader,
  PopoverBody,
} from "reactstrap";

import {
  Navbar,
  Nav,
  NavDropdown,
  Form,
  FormControl,
  Button,
} from "react-bootstrap";

import "bootstrap/dist/css/bootstrap.css";

import { faUser, faUserCircle } from "@fortawesome/free-regular-svg-icons";
import TextField from "../TextField/TextField";
import "./Navbarku.css";
import ButtonUI from "../Button/Button";
import {
  logoutHandler,
  onSearchInput,
  cartUpdate,
} from "../../../redux/actions";
import { API_URL } from "../../../constants/API";

const CircleBg = ({ children }) => {
  return <div className="circle-bg">{children}</div>;
};

class Navbar1 extends React.Component {
  state = {
    searchBarIsFocused: false,
    searchBarInput: "",
    dropdownOpen: false,
    itemsNumberOnNavbar: 0,
    userIdActive: 0,
    open: false,
  };



  searcBarInputHandler = (e) => {
    const { searchBarInput } = this.state;
    const { value } = e.target;
    this.setState({ searchBarInput: value });
    this.props.onSearchInput(searchBarInput);
  };
  onFocus = () => {
    this.setState({ searchBarIsFocused: true });
  };

  onBlur = () => {
    this.setState({ searchBarIsFocused: false });
  };

  logoutBtnHandler = () => {

    // this.props.onLogout();
    alert("sd2")
    return <Redirect to="/history"/>
  
  };

  toggleDropdown = () => {
    this.setState({ dropdownOpen: !this.state.dropdownOpen });
  };

  setOpen = () => {
    this.setState({ open: !this.state.open });
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


                        <DropdownItem
                          className="text-center "
                        >

                          <Button type="button" className="btn btn-danger" onClick={this.logoutBtnHandler}>
                            Logout
                              </Button>


                        </DropdownItem>
                      </>
                    ) : (
                        <>
                          <DropdownItem onClick={() => this.props.onLogout()}>
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
                            onClick={this.logoutBtnHandler}
                            className="text-center "
                          >
                            <Button type="button" className="btn btn-danger">
                              Logout
                          </Button>
                          </DropdownItem>
                        </>
                      )}
                  </DropdownMenu>
                </Dropdown>
              </>
            ) : (
                <>
                  <Link id="oke" style={{ color: "inherit" }} to="/auth">
                    <FontAwesomeIcon
                      className="mr-2"
                      icon={faSignInAlt}
                      style={{ fontSize: 20, color: "white" }}
                    />
                  Login
                </Link>
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
          <Navbar.Brand href="#home" className="border">
          <div className="logo-text ml-3">
            <Link
              id="oke"
              style={{ textDecoration: "none", color: "inherit" }}
              to="/"
            >
              NEW STYLE
            </Link>
          </div>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav"/>
          <Navbar.Collapse id="basic-navbar-nav" className="p-0">
        
          <div className="cat-text border">
            <Link style={{ textDecoration: "none", color: "inherit" }} to="/">
              MEN
            </Link>
          </div>

          <div className="cat-text border">
            <Link style={{ textDecoration: "none", color: "inherit" }} to="/">
              WOMEN
            </Link>
          </div>
          
          <div className="cat-text">
            <Link style={{ textDecoration: "none", color: "inherit" }} to="/">
              BEST SELLER
            </Link>
          </div>
          <div className="cat-text">
            <Link style={{ textDecoration: "none", color: "inherit" }} to="/">
              SALE
            </Link>
          </div>

          <div
            style={{ display: "flex", flex: "1" }}
            className=""
          >
            <input
              className="m-auto w-100 justify-content-center"
              type="text"
              placeholder="Find your products here"
              onChange={(e) => this.props.onSearchInput(e.target.value)}
            />
          </div>

          <div
            style={{ flex: "0" }}
            className=""
          >
            <Link
              className="d-flex flex-column justify-content-center pl-2"
              to="/cart"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div style={{ justifyContent: "flex-end" }} className="d-flex">
                <CircleBg>
                  <small className="pt-2"
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
  onLogout: logoutHandler,
  onSearchInput,
  cartUpdate,
};
export default connect(mapStateToProps, mapDispatchToProps)(Navbar1);
