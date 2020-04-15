import { GET_SITE_DATA, UPDATE_SITE_DATA } from "../actions/types";

export default function (state = {}, action) {
  switch (action.type) {
    case GET_SITE_DATA:
      return { ...state, siteData: action.payload };
    case UPDATE_SITE_DATA:
      //check from the server.js app.post("/api/site/site_data") route,
      //the returning object is:
      // res.status(200).send({
      //   success: true,
      //   siteInfo: doc.siteInfo,
      // });
      //this is the reason why "siteData: action.payload.siteInfo"
      return { ...state, siteData: action.payload.siteInfo };
    default:
      return state;
  }
}
