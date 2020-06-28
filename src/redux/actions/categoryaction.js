
import categoryTypes from "../types/category";
const {ON_CATEGORY_CHANGE, } = categoryTypes;

export const onCategoryChange = (categoryActive) => {
    return {
      type: ON_CATEGORY_CHANGE,
      payload : categoryActive
    };
  };