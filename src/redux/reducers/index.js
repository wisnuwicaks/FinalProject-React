import { combineReducers } from "redux";
import userReducer from "./user";
import searchReducer from "./search";
import categoryActive from "./categoryreducer";

export default combineReducers({
  user: userReducer,
  searchInput : searchReducer,
  categoryActive
});
