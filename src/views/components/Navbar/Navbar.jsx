import React from "react";
import {Link} from "react-router-dom";
import { connect } from "react-redux";
import Axios from 'axios'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faCartPlus } from "@fortawesome/free-solid-svg-icons/";
import {
  Dropdown,
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
  Container, Row, Col, Button,Collapse,UncontrolledPopover, PopoverHeader, PopoverBody
} from "reactstrap";

import { faUser,faUserCircle } from "@fortawesome/free-regular-svg-icons";
import TextField from '../TextField/TextField'
import "./Navbar.css";
import ButtonUI from "../Button/Button";
import { logoutHandler,onSearchInput,itemOnTableChange } from "../../../redux/actions";
import { API_URL } from "../../../constants/API";

const CircleBg = ({ children }) => {
  return <div className="circle-bg">{children}</div>;
};

class Navbar extends React.Component {
  state = {
    searchBarIsFocused: false,
    searchBarInput: "",
    dropdownOpen: false,
    itemsNumberOnNavbar :0,
    userIdActive : 0,
    open : false
  };

  componentDidMount(){  
    
  }

 
  //komponen ini hanya akan berjalan sekali ketika terdapat perubahan user active 
  //baik ketika logout atau signin
  componentDidUpdate(){ //hanya akan ketriger jika userID global state dan userIdActive berbeda
    const {itemsNumberOnNavbar,itemsOnCart} = this.state

  }
 
 
  searcBarInputHandler = (e) =>{
    const {searchBarInput} = this.state
    const {value} = e.target
    this.setState({searchBarInput:value});
    this.props.onSearchInput(searchBarInput)
  }
  onFocus = () => {
    this.setState({ searchBarIsFocused: true });
  };

  onBlur = () => {
    this.setState({ searchBarIsFocused: false });
  };

  logoutBtnHandler = () => {
    alert("sda")
    this.props.onLogout();
    // this.forceUpdate();
  };

  toggleDropdown = () => {
    this.setState({ dropdownOpen: !this.state.dropdownOpen });
  };

  setOpen = () =>{
    this.setState({open:!this.state.open})
  }

  render() {
    return (
      <div>
        <div className="d-flex flex-row justify-content-end navbar-container-black">
          <div className="login-text col-auto p-2 ">
            {this.props.user.id ? (
              <>
                <Dropdown
                  toggle={this.toggleDropdown}
                  isOpen={this.state.dropdownOpen}
                >
                  <DropdownToggle tag="div" className="d-flex" color="white">
                    <FontAwesomeIcon icon={faUserCircle} style={{ fontSize: 24}} />
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

                        <DropdownItem onClick={this.logoutBtnHandler} className="text-center ">
                          <Button type="button" className="btn btn-danger">Logout</Button>
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
                        <DropdownItem onClick={this.logoutBtnHandler} className="text-center ">
                          <Button type="button"  className="btn btn-danger">Logout</Button>
                        </DropdownItem>
                      </>
                    )}
                  </DropdownMenu>
                </Dropdown>
              </>
            ) : (
              <>
                <Link id="oke" style={{ color: "inherit" }} to="/auth">
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
        <div className="d-flex flex-row justify-content-between align-items-center navbar-container">
          <div className="logo-text col-auto ">
            <Link
              id="oke"
              style={{ textDecoration: "none", color: "inherit" }}
              to="/"
            >
              NEW STYLE
            </Link>
          </div>

          <div
            className="cat-text border"
            toggle="popover"
            trigger="hover"
            placement="bottom"
            content="Content"
          >
            <Link style={{ textDecoration: "none", color: "inherit" }} to="/">
              MEN
            </Link>
          </div>
          <div className="cat-text border">
            <Link style={{ textDecoration: "none", color: "inherit" }} to="/">
              WOMEN
            </Link>
          </div>
          <div className="cat-text border">
            <Link style={{ textDecoration: "none", color: "inherit" }} to="/">
              BEST SELLER
            </Link>
          </div>
          <div className="cat-text border">
            <Link style={{ textDecoration: "none", color: "inherit" }} to="/">
              SALE
            </Link>
          </div>
          <div
            style={{ flex: 1 }}
            className="px-3 d-flex flex-row justify-content-start border"
          >
            <TextField
              type="text"
              placeholder="Find your products here"
              onChange={(e) => this.props.onSearchInput(e.target.value)}
            ></TextField>
          </div>
          <div className="d-flex flex-row align-items-center">
       
                <Link
                  className="d-flex flex-column border"
                  to="/cart"
                  style={{ textDecoration: "none", color: "inherit" }}
                  
                >
                  <div className="pl-5 cart-margin">
                    <CircleBg>
                      <small style={{ color: "black", fontWeight: "bold", fontSize:"12px" }}>
                        {this.props.user.itemsOnTable}
                      </small>
                    </CircleBg>
                  </div>
                    <FontAwesomeIcon
                      className="mr-2"
                      icon={faCartPlus}
                      style={{ fontSize: 40,color:"white"}}
                    />
              
                </Link>

           
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    user: state.user,
    search : state.searchInput
  };
};
const mapDispatchToProps = {
  onLogout: logoutHandler,
  onSearchInput,
  itemOnTableChange,
};
export default connect(mapStateToProps, mapDispatchToProps)(Navbar);