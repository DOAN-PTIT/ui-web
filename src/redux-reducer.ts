import { combineReducers } from "redux";
import productReducer from "./reducer/product.reducer";
import userReducer from "./reducer/user.reducer";
import shopReducer from "./reducer/shop.reducer";
import orderReducer from "./reducer/order.reducer";
import variationReducer from "./reducer/variation.reducer";

const rootReducer = combineReducers({
    productReducer,
    userReducer,
    shopReducer,
    orderReducer,
    variationReducer
});

export default rootReducer;
