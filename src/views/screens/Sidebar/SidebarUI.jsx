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
  faHome,
  faBriefcase,
  faPaperPlane,
  faQuestion,
  faImage,
  faCopy,
} from "@fortawesome/free-solid-svg-icons/";
import { faUser, faUserCircle } from "@fortawesome/free-regular-svg-icons";

import {
  Dropdown,
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
  Modal,
  ModalHeader,
  ModalBody,
  NavItem,
  NavLink,
  Nav,
} from "react-bootstrap";

import "bootstrap/dist/css/bootstrap.css";

import TextField from "../../components/TextField/TextField";
import "./SidebarUI.css";
import ButtonUI from "../../components/ButtonUI/ButtonUI";
import {
  registerHandler,
  loginHandler,
  logoutHandler,
  onSearchInput,
  cartUpdate,
  onCategoryChange,
} from "../../../redux/actions";
import { API_URL } from "../../../constants/API";

class SidebarUI extends React.Component {
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

  searcBarInputHandler = (e) => {};

  inputHandler = (e, field, form) => {
    const { value } = e.target;

    this.setState({
      [form]: {
        ...this.state[form],
        [field]: value,
      },
    });
  };

  render() {
    return (
      <>
        <div className="col-2  sidebarProps">
          <dir className="m-2 "> 
            <div className="panelTitle w-100">
              <Link className="textWhite" to="/admin/dashboard">
                Admin Panel
              </Link>
            </div>
            <div>
              <Link className="textWhite" to="/admin/report">
                Report
              </Link>
            </div>
            <div>
              <Link className="textWhite" to="/admin/payment">
                Payment
              </Link>
            </div>
          </dir>
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

export default connect(mapStateToProps, mapDispatchToProps)(SidebarUI);
