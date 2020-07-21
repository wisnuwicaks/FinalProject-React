import Axios from "axios";
import userTypes from "../types/user";

const { ON_SEARCH } = userTypes


export const onSearchProduct = (inputSearch) => {
    return {
        type: ON_SEARCH,
        payload: inputSearch
    }
}