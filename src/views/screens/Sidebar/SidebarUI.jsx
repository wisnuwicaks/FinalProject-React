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
  faEdit,
  faPlusSquare,
  faStickyNote,
  faMoneyCheck,
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
          <dir className="ml-2">
            <div className="panelTitle w-100">
              <Link className="textWhite" to="/admin/dashboard">
                <h6>
                  <FontAwesomeIcon icon={faEdit} /> Product Edit
                </h6>
              </Link>
            </div>
            <div>
              <Link className="textWhite" to="/admin/add_product">
                <h6>
                  {" "}
                  <FontAwesomeIcon icon={faPlusSquare} /> Add Product
                </h6>
              </Link>
            </div>
            <div>
              <Link className="textWhite" to="/admin/report">
                <h6>
                  {" "}
                  <FontAwesomeIcon icon={faStickyNote} /> Report
                </h6>
              </Link>
            </div>
            <div>
              <Link className="textWhite" to="/admin/payment">
                <h6>
                  <FontAwesomeIcon icon={faMoneyCheck} /> Payment
                </h6>
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
  };
};
const mapDispatchToProps = {
  onLogin: loginHandler,
  onRegister: registerHandler,
  onLogout: logoutHandler,
  cartUpdate,
  onCategoryChange,
};

export default connect(mapStateToProps, mapDispatchToProps)(SidebarUI);
