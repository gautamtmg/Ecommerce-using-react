import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import { productListReducer,
    productDetailsReducer, 
    productDeleteReducer, 
    productCreateReducer, 
    productUpdateReducer,
    productCreateReviewReducer,
    productTopRatedReducer,
    productListReducerVendor,
} from './reducers/productReducer'
import { cartReducer } from './reducers/cartReducer'
import { userLoginReducer,
    userRegisterReducer, 
    userDetailsReducer, 
    userUpdateProfileReducer, 
    userListsReducer, 
    userDeleteReducer, 
    userUpdateProfile,
    userUpdateReducer,


} from './reducers/userReducer'
import { orderCreateReducer, orderDetailsReducer, orderPayReducer, orderDeliverReducer, orderListMyReducer, orderListReducer } from './reducers/orderReducer'

const reducer = combineReducers({
    productListVendor: productListReducerVendor,
    productList: productListReducer,
    productDetails: productDetailsReducer,
    productDelete: productDeleteReducer,
    productCreate: productCreateReducer,
    productUpdate:productUpdateReducer,
    productCreateReview: productCreateReviewReducer,
    productTopRated: productTopRatedReducer,
    cart: cartReducer,

    userLogin: userLoginReducer,
    userRegister: userRegisterReducer,
    userDetails: userDetailsReducer,
    userUpdateProfile: userUpdateProfileReducer,
    usersList: userListsReducer,
    userDelete: userDeleteReducer,
    userUpdate:userUpdateReducer,


    orderCreate: orderCreateReducer,
    orderDetails: orderDetailsReducer,
    orderPay: orderPayReducer,
    orderDeliver: orderDeliverReducer,
    orderListMy: orderListMyReducer,
    orderList: orderListReducer,
})

const cartItemsFromStorage = localStorage.getItem('cartItems') ?
                            JSON.parse(localStorage.getItem('cartItems')) : []


const shippingAddressFromStorage = localStorage.getItem('shippingAddress') ?
                            JSON.parse(localStorage.getItem('shippingAddress')) : {}

const userInfoFromStorage = localStorage.getItem('userInfo') ?
                            JSON.parse(localStorage.getItem('userInfo')) : null

const initialState = {
    cart:{cartItems: cartItemsFromStorage, shippingAddress: shippingAddressFromStorage},
    userLogin:{userInfo: userInfoFromStorage}
}
const middleware = [thunk]

const store = createStore(reducer, initialState,
    composeWithDevTools(applyMiddleware(...middleware)))

export default store