import categoryTypes from "../types/category";

const { ON_CATEGORY_CHANGE } = categoryTypes;

let init_state = {
  categoryActive: 2,
};

export default (state = init_state, action) => {
  switch (action.type) {
    case ON_CATEGORY_CHANGE:
      alert(action.payload+"ini action payload")
      return { ...state,categoryActive: action.payload };
    default:
      return { ...init_state };
  }
};
