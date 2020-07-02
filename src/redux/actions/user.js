import Axios from "axios";
import { API_URL } from "../../constants/API";
import Cookie from "universal-cookie";
import userTypes from "../types/user";
import swal from "sweetalert";

const {
  ON_LOGIN_FAIL,
  ON_LOGIN_SUCCESS,
  ON_REGISTER_SUCCESS,
  ON_REGISTER_FAIL,
  ON_LOGOUT_SUCCESS,
  ITEMS_ON_TABLE_CHANGE,
  ON_CART_UPDATE,
  ON_WISHLIST_UPDATE,
} = userTypes;

const cookieObj = new Cookie();

export const loginHandler = (userData) => {
  return (dispatch) => {
    const { username, password } = userData;

    // Axios.get(`${API_URL}/users`, {
    //   params: {
    //     username,
    //     password,
    //   },
    // })
    Axios.post(`${API_URL}/users/login`, userData)
      .then((res) => {
        console.log(res.data);
        if (res.data !== null) {
          swal("Login Success", "Happy shoping", "success");

          dispatch({
            type: ON_LOGIN_SUCCESS,
            payload: res.data,
          });
          Axios.get(`${API_URL}/carts/user/${res.data.id}`)
            .then((res) => {
              dispatch({
                type: ON_CART_UPDATE,
                payload: res.data.length,
              });
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          swal("Login Failed", "Username or password was wrong", "error");
          dispatch({
            type: ON_LOGIN_FAIL,
            payload: "Username or password was wrong",
          });
        }
      })
      .catch((err) => {
        swal("Login Failed", "Username or password was wrong", "error");
        console.log(err);
        dispatch({
          type: ON_LOGIN_FAIL,
          payload: "Username or password was wrong",
        });
      });
  };
};

export const userKeepLogin = (userData) => {
  
  return (dispatch) => {
    Axios.post(`${API_URL}/users/login`, userData)
      .then((res) => {
        if (res.data !== null) {
          dispatch({
            type: ON_LOGIN_SUCCESS,
            payload: res.data,
          });
        } else {
          dispatch({
            type: ON_LOGIN_FAIL,
            payload: "Username or password was wrong",
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
};

export const logoutHandler = () => {
  alert("log");
  cookieObj.remove("authData", { path: "/" });
  return {
    type: ON_LOGOUT_SUCCESS,
  };
};

export const registerHandler = (userData) => {
  return (dispatch) => {
    Axios.post(`${API_URL}/users/getemail`, userData)
      .then((res) => {
        console.log(res.data);
        if (res.data.length <= 0) {
          // dispatch({
          //   type: ON_REGISTER_FAIL,
          //   payload: "Email already used",
          // });
          Axios.post(`${API_URL}/users/getusername`, userData)
            .then((res) => {
              if (res.data.length <= 0) {
                Axios.post(`${API_URL}/users/register`, userData)
                  .then((res) => {
                    swal(
                      "Regitration Success",
                      "Please Sign-in to buy",
                      "success"
                    );
                    console.log(userData);
                    dispatch({
                      type: ON_REGISTER_SUCCESS,
                      payload: userData,
                    });
                  })
                  .catch((err) => {
                    swal(
                      "Regitration Failed",
                      "Email not valid",
                      "error"
                    );
                    console.log(err);
                  });
              } else {
                swal(
                  "Registration Failed",
                  "Sorry username already registered",
                  "error"
                );
              }
            })
            .catch();
        } else {
          swal(
            "Registration Failed",
            "Sorry email already registered",
            "error"
          );
        }
      })
      .catch((err) => {
        alert("error");
        console.log(err);
      });
  };
};

export const cookieChecker = () => {
  return {
    type: "COOKIE_CHECK",
  };
};

// export const onSearchInput = (searchInput) => {
//   return {
//     type: ON_SEARCH_INPUT_CHANGE,
//     payload : searchInput
//   };
// };

export const cartUpdate = (userIdNow) => {
  console.log(userIdNow);
  return (dispatch) => {
    Axios.get(`${API_URL}/carts/user/${userIdNow}`)
      .then((res) => {
        dispatch({
          type: ON_CART_UPDATE,
          payload: res.data.length,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
};

export const wishlistUpdate = (userId) => {
  return (dispatch) => {
    Axios.get(`${API_URL}/wishlist`, {
      params: {
        userId: userId,
      },
    })
      .then((res) => {
        const { data } = res;
        let productIdData = [];
        data.forEach((val) => {
          productIdData.push(val.productId);
        });
        dispatch({
          type: ON_WISHLIST_UPDATE,
          payload: productIdData,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
};
