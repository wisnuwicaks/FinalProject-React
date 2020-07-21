import { combineReducers } from "redux";
import userReducer from "./user";
import searchReducer from "./search";
import categoryReducer from "./categoryreducer";

export default combineReducers({
  user: userReducer,
  search: searchReducer,
  category :categoryReducer
});
