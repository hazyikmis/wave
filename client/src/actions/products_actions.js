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
  ADD_BRAND,
  ADD_WOOD,
  GET_PRODUCT_DETAIL,
  CLEAR_PRODUCT_DETAIL,
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

//after inserting one brand, we are returning all brands
//but in the server route, it returns just the newly added brand
//we might change the server route, thats possible. Bu we preferrred to return all brands here
export function addBrand(dataToSubmit, existingBrands) {
  const req = axios
    .post(`${PRODUCT_SERVER}/brand`, dataToSubmit)
    .then((response) => {
      let brands = [...existingBrands, response.data.brand];
      return {
        success: response.data.success,
        brands,
      };
    });

  return {
    type: ADD_BRAND,
    payload: req,
  };
}

//same as addBrand
export function addWood(dataToSubmit, existingWoods) {
  const req = axios
    .post(`${PRODUCT_SERVER}/wood`, dataToSubmit)
    .then((response) => {
      let woods = [...existingWoods, response.data.wood];
      return {
        success: response.data.success,
        woods,
      };
    });

  return {
    type: ADD_WOOD,
    payload: req,
  };
}

export function getProductDetail(id) {
  const prodReq = axios
    .get(`${PRODUCT_SERVER}/articles_by_id?id=${id}&type=single`)
    .then((response) => {
      //console.log(response.data);
      return response.data[0];
    })
    .catch((err) =>
      console.log("ERROR in getProductDetail products_action", err)
    );

  return {
    type: GET_PRODUCT_DETAIL,
    payload: prodReq,
  };
}

export function clearProductDetail() {
  return {
    type: CLEAR_PRODUCT_DETAIL,
    payload: "",
  };
}
