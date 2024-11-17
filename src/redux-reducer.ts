import { combineReducers } from "redux";
import productReducer from "./reducer/product.reducer";
import userReducer from "./reducer/user.reducer";
import shopReducer from "./reducer/shop.reducer";

const rootReducer = combineReducers({
    productReducer,
    userReducer,
    shopReducer
});

export default rootReducer;
