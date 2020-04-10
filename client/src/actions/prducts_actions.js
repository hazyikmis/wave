import axios from "axios";

import { PRODUCT_SERVER } from "../components/utils/misc";
import { GET_PRODUCTS_BY_SELL, GET_PRODUCTS_BY_ARRIVAL } from "./types";

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
