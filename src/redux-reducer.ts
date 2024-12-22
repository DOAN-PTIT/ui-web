import { combineReducers } from "redux";
import productReducer from "./reducer/product.reducer";
import userReducer from "./reducer/user.reducer";
import shopReducer from "./reducer/shop.reducer";
import orderReducer from "./reducer/order.reducer";
import variationReducer from "./reducer/variation.reducer";
import supplierReducer from "./reducer/supplier.reducer";
import debtReducer from "./reducer/debt.reducer";
import purchaseReducer from "./reducer/purchase.reducer";
import reportReducer from "./reducer/report.reducer";

const rootReducer = combineReducers({
    productReducer,
    userReducer,
    shopReducer,
    orderReducer,
    variationReducer,
    supplierReducer,
    debtReducer,
    purchaseReducer,
    reportReducer
});

export default rootReducer;
