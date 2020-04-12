import React, { Component } from "react";

//connect used because in this page (route), there is a ":id" coming as a parameter
//so we need to access product info from redux store-state
import { connect } from "react-redux";

import { PageTop } from "../utils/page_top";
import {
  getProductDetail,
  clearProductDetail,
} from "../../actions/products_actions";

import { ProdInfo } from "./prodInfo";

class ProductPage extends Component {
  componentDidMount() {
    const id = this.props.match.params.id;
    //console.log(id);
    this.props.dispatch(getProductDetail(id));
  }

  //this method helps us to clear product from redux store
  componentWillUnmount() {
    this.props.dispatch(clearProductDetail());
  }

  render() {
    return (
      <div>
        <PageTop title="Product detail" />
        <div className="container">
          {this.props.products.prodDetail ? (
            <div className="product_detail_wrapper">
              <div className="left">images</div>
              <div className="right">
                <ProdInfo
                  addToCart={(id) => this.addToCartHandler(id)}
                  detail={this.props.products.prodDetail}
                />
              </div>
            </div>
          ) : (
            "Loading"
          )}
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

export default connect(mapStateToProps)(ProductPage);
