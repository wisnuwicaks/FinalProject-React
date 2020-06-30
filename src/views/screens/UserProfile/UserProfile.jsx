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

import {
  Col,
  Form,
  FormGroup,
  InputGroup,
  Button,
  Navbar,
  FormControl,
} from "react-bootstrap";

class UserProfile extends React.Component {
  state = {
    editKeyState: [],
    completeKeyData:[],
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
            ["password"]: res.data.password,
          },
        });
        this.setState({completeKeyData:res.data})
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

  postUserProfile = () =>{
      const{userActive, completeKeyData} = this.state
      let userData = {...completeKeyData,...userActive, }
      Axios.put(`${API_URL}/users/updateprofile`,userData)
      .then((res)=>{
        console.log("berhasil"); 
          alert("berhasil")
          console.log(res.data); 
      })
      .catch(err=>{
          console.log(err);
          
      })
  }

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
                onChange={(e)=>this.inputHandler(e,val,"userActive")}
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
          )
          }
        </tr>
      );
    });
  };
  render() {
    return (
      <>
        <div className="container mt-4 justify-content-center">
          <div className="row">
            <div className="d-flex col-3 border justify-content-center align-items-center">
              <img
                src={
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQqRA4pk3_Er5dT5EIWADXtJdR-sIocsukz0Q&usqp=CAU"
                }
                alt=""
              />
            </div>
            <div className="col">
              <table>{this.renderUserProdfile()}</table>
              <Button onClick={this.postUserProfile}>SUBMIT CHANGE</Button>
            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);
