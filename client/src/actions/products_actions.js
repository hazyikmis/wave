import axios from "axios";

import { PRODUCT_SERVER } from "../components/utils/misc";
import {
  GET_PRODUCTS_BY_SELL,
  GET_PRODUCTS_BY_ARRIVAL,
  GET_BRANDS,
  GET_WOODS,
  GET_PRODUCTS_TO_SHOP,
  ADD_PRODUCT,
  CLEAR_PRODUCT,
} from "./types";

//GET http://localhost:3002/api/product/articles?sortBy=sold&order=desc&limit=4
export function getProductsBySell() {
  const request = axios
    .get(`${PRODUCT_SERVER}/articles?sortBy=sold&order=desc&limit=4`)
    .then((response) => response.data);

  return {
    type: GET_PRODUCTS_BY_SELL,
    payload: request,
  };
}

//GET http://localhost:3002/api/product/articles?sortBy=createdAt&order=desc&limit=4
export function getProductsByArrival() {
  const request = axios
    .get(`${PRODUCT_SERVER}/articles?sortBy=createdAt&order=desc&limit=4`)
    .then((response) => response.data);

  return {
    type: GET_PRODUCTS_BY_ARRIVAL,
    payload: request,
  };
}

//////////////////////////////////////////
/////    CATEGORIES
//////////////////////////////////////////

//no difference: export function getBrands() {...} is also ok.
export const getBrands = () => {
  const brandsRequest = axios
    .get(`${PRODUCT_SERVER}/brands`)
    .then((response) => response.data);

  return {
    type: GET_BRANDS,
    payload: brandsRequest,
  };
};

export function getWoods() {
  const woodsRequest = axios
    .get(`${PRODUCT_SERVER}/woods`)
    .then((response) => response.data);

  return {
    type: GET_WOODS,
    payload: woodsRequest,
  };
}

export function getProductsToShop(
  skip,
  limit,
  filters = [],
  previousState = []
) {
  //previousState is not a complete state, just a list of articles (products)

  const paramsData = {
    skip,
    limit,
    filters,
  };

  const prodRequest = axios
    .post(`${PRODUCT_SERVER}/shop`, paramsData)
    .then((response) => {
      let newState = [...previousState, ...response.data.articles];

      return {
        size: response.data.size,
        //articles: response.data.articles,
        articles: newState,
      };
    });

  return {
    type: GET_PRODUCTS_TO_SHOP,
    payload: prodRequest,
  };
}

export function addProduct(dataToSubmit) {
  const req = axios
    .post(`${PRODUCT_SERVER}/article`, dataToSubmit)
    .then((response) => response.data);

  return {
    type: ADD_PRODUCT,
    payload: req,
  };
}

//this function used fro clearing redux store...
//becasue, after adding the products, the information of newly added product still lives there
//sometimes this cluld be useful! but here we are clearing it
export function clearProduct() {
  return {
    type: CLEAR_PRODUCT,
    payload: "",
  };
}
