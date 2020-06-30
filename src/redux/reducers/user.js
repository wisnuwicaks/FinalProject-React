import userTypes from "../types/user";

const { ON_LOGIN_FAIL, 
  ON_LOGIN_SUCCESS, 
  ON_LOGOUT_SUCCESS,
  ON_REGISTER_FAIL,
  ON_REGISTER_SUCCESS,
  ITEMS_ON_TABLE_CHANGE,
  ON_CART_UPDATE,
  ON_WISHLIST_UPDATE 
} = userTypes;

const init_state = {
  id: 0,
  username: "",
  fullName: "",
  email : "",
  address: {},
  role: "",
  errMsg: "",
  cookieChecked: false,
  cartItemsCount : 0,
  wishListItems :[]
};

export default (state = init_state, action) => {
  switch (action.type) {
    case ON_LOGIN_SUCCESS:
      const { username,email, fullName, role,id,password,profilePicture } = action.payload;
      return {
        ...state,
        username,
        password,
        email,
        fullName,
        profilePicture,
        role,
        id,
        cookieChecked: true,
      };
      
    case ON_LOGIN_FAIL:
      return { ...state, errMsg: action.payload,cookieChecked:true };
    case ON_REGISTER_FAIL:
      return { ...state, errMsg: action.payload, cookieChecked:true };
    case ON_LOGOUT_SUCCESS:
      return { ...init_state, cookieChecked:true };
    case "COOKIE_CHECK":
      return { ...state, cookieChecked: true };
    case ON_CART_UPDATE:
      return { ...state, cartItemsCount: action.payload };
    case ON_WISHLIST_UPDATE:
      return { ...state, wishListItems: action.payload};
    default:
      return { ...state, };
  }
};
