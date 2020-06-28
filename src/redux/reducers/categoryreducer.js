import categoryTypes from "../types/category";

const { 
  ON_CATEGORY_CHANGE,
} = categoryTypes;

const init_state = {
  categoryActive : 'Men',
};

export default (state = init_state, action) => {
  switch (action.type) {
    case ON_CATEGORY_CHANGE :
      return { ...state, categoryActive:action.payload };
    default:
      return { ...init_state };
  }
};
