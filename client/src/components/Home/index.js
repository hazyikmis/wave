import React, { Component } from "react";
import { HomeSlider } from "./home_sider";
import { HomePromotion } from "./home_promotion";

import { connect } from "react-redux";
import {
  getProductsBySell,
  getProductsByArrival,
} from "../../actions/products_actions";

import { CardBlock } from "../utils/card_block";

class Home extends Component {
  componentDidMount() {
    this.props.dispatch(getProductsBySell());
    this.props.dispatch(getProductsByArrival());
  }

  render() {
    return (
      <div>
        <div>
          <HomeSlider />
          <CardBlock
            listOfCards={this.props.products.bySell}
            title="Best selling guitars"
          />
          <HomePromotion />
          <CardBlock
            listOfCards={this.props.products.byArrival}
            title="New arrivals"
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    products: state.products,
  };
};

export default connect(mapStateToProps)(Home);
