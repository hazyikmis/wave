import React, { Component } from "react";
import { HomeSlider } from "./home_sider";
import { HomePromotion } from "./home_promotion";

export default class index extends Component {
  render() {
    return (
      <div>
        <div>
          <HomeSlider />
          <HomePromotion />
        </div>
      </div>
    );
  }
}
