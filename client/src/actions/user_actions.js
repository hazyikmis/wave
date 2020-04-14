import axios from "axios";

import { USER_SERVER, PRODUCT_SERVER } from "../components/utils/misc";

import {
  LOGIN_USER,
  REGISTER_USER,
  AUTH_USER,
  LOGOUT_USER,
  ADD_TO_CART_USER,
  GET_CART_ITEMS_USER,
  REMOVE_CART_ITEM_USER,
} from "./types";

export function loginUser(dataToSubmit) {
  const request = axios
    .post(`${USER_SERVER}/login`, dataToSubmit)
    .then((response) => response.data);

  return {
    type: LOGIN_USER,
    payload: request,
  };
}

export function registerUser(dataToSubmit) {
  const request = axios
    .post(`${USER_SERVER}/register`, dataToSubmit)
    .then((response) => response.data);

  return {
    type: REGISTER_USER,
    payload: request,
  };
}

export function auth() {
  const request = axios
    .get(`${USER_SERVER}/auth`)
    .then((response) => response.data)
    .catch((err) => console.log("ERROR in auth user_action", err));

  return {
    type: AUTH_USER,
    payload: request,
  };
}

export function logoutUser() {
  const request = axios
    .get(`${USER_SERVER}/logout`)
    .then((response) => response.data);

  return {
    type: LOGOUT_USER,
    payload: request,
  };
}

export function addToCart(_id) {
  const req = axios
    .post(`${USER_SERVER}/addToCart?productId=${_id}`)
    .then((response) => response.data);

  return {
    type: ADD_TO_CART_USER,
    payload: req,
  };
}

export function getCartItems(cartItems, userCart) {
  const request = axios
    .get(`${PRODUCT_SERVER}/articles_by_id?id=${cartItems}&type=array`)
    .then((response) => {
      //console.log(response.data);
      //return response.data;

      //a quantity field will be added to the product objects
      userCart.forEach((item) => {
        response.data.forEach((k, i) => {
          if (item.id === k._id) {
            response.data[i].quantity = item.quantity;
          }
        });
      });
      // console.log(response.data);
      return response.data;
    });

  return {
    type: GET_CART_ITEMS_USER,
    payload: request,
  };
}

export function removeCartItem(id) {
  const request = axios
    .get(`${USER_SERVER}/removeFromCart?_id=${id}`)
    .then((response) => {
      //returning response.data object has 2 objects: cartDetail & cart
      //check "app.get("/api/users/removeFromCart" server.js route for response.data structure...
      response.data.cart.forEach((item) => {
        response.data.cartDetail.forEach((k, i) => {
          if (item.id == k._id) {
            //we are manupulating response.data just before returning & processing it
            response.data.cartDetail[i].quantity = item.quantity;
          }
        });
      });
      //now, response.data object still has 2 objects: cartDetail & cart
      //but additionally cartDetail has "quantity" field
      //now this info passed to the "reducer" to arrange state/store accordingly
      return response.data;
    });

  return {
    type: REMOVE_CART_ITEM_USER,
    payload: request,
  };
}
