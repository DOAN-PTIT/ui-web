import { combineReducers } from "redux";
import productReducer from "./reducer/product.reducer";

const rootReducer = combineReducers({
    productReducer
});

export default rootReducer;
