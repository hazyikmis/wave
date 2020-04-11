import React, { Component } from "react";
import { PageTop } from "../utils/page_top";
import { connect } from "react-redux";

import {
  getBrands,
  getWoods,
  getProductsToShop,
} from "../../actions/products_actions";

import CollapsableCheckBoxList from "../utils/collapse_checkbox";

import { frets, prices } from "../utils/Form/fixed_categories";

import CollapsableRadioButtonList from "../utils/collapse_radio";

import { LoadmoreCarts } from "./loadmoreCarts";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import faBars from "@fortawesome/fontawesome-free-solid/faBars";
import faTh from "@fortawesome/fontawesome-free-solid/faTh";

class Shop extends Component {
  state = {
    grid: "",
    limit: 6,
    skip: 0,
    filters: {
      brand: [],
      frets: [],
      wood: [],
      price: [],
    },
  };

  componentDidMount() {
    this.props.dispatch(getBrands());
    this.props.dispatch(getWoods());

    this.props.dispatch(
      getProductsToShop(this.state.skip, this.state.limit, this.state.filters)
    );
  }

  handlePrice = (filters) => {
    let priceRange = [];

    for (let key in prices) {
      if (prices[key]._id === parseInt(filters, 10)) {
        priceRange = prices[key].range;
      }
    }
    return priceRange;
  };

  showFilteredResults = (filters) => {
    this.props
      .dispatch(getProductsToShop(0, this.state.limit, filters))
      .then(() => {
        this.setState({
          skip: 0,
        });
      });
  };

  handleFilters = (filters, category) => {
    //on every-click, "filters" contains the array of only selected brands or only selected frest or only selected woods
    //so, when handling all filters together we need to use state (until that moment, for this class we had not need any state)
    //console.log(filters, category);
    const newFilters = { ...this.state.filters };
    newFilters[category] = filters;

    if (category === "price") {
      let priceValues = this.handlePrice(filters);
      newFilters[category] = priceValues;
    }

    this.showFilteredResults(newFilters);

    this.setState({
      filters: newFilters,
    });
    //if you want to follow the change in the state, you need to
    //put console.log(this.state) just at the beginning of render function
  };

  loadMoreCarts = () => {
    let skip = this.state.skip + this.state.limit;

    this.props
      .dispatch(
        getProductsToShop(
          skip,
          this.state.limit,
          this.state.filters,
          this.props.products.toShop
        )
      )
      .then(() => {
        this.setState({
          skip,
        });
      });
  };

  handleGrid = () => {
    this.setState({
      grid: !this.state.grid ? "grid_bars" : "",
    });
  };

  render() {
    //console.log(this.state.filters);

    const products = this.props.products;

    //BE CAREFUL: brands & woods come from mongodb, but frets & prices come from mongodb-like fixed array of objects
    return (
      <div>
        <PageTop title="Browse products" />
        <div className="container">
          <div className="shop_wrapper">
            <div className="left">
              <CollapsableCheckBoxList
                initState={true}
                title="Brands"
                list={products.brands}
                handleFilters={(filters) =>
                  this.handleFilters(filters, "brand")
                }
              />
              <CollapsableCheckBoxList
                initState={false}
                title="Frets"
                list={frets}
                handleFilters={(filters) =>
                  this.handleFilters(filters, "frets")
                }
              />
              <CollapsableCheckBoxList
                initState={false}
                title="Woods"
                list={products.woods}
                handleFilters={(filters) => this.handleFilters(filters, "wood")}
              />
              <CollapsableRadioButtonList
                initState={true}
                title="Price"
                list={prices}
                handleFilters={(filters) =>
                  this.handleFilters(filters, "price")
                }
              />
            </div>
            <div className="right">
              <div className="shop_options">
                <div className="shop_grids clear">
                  <div
                    className={`grid_btn ${this.state.grid ? "" : "active"}`}
                    onClick={() => this.handleGrid()}
                  >
                    <FontAwesomeIcon icon={faTh} />
                  </div>
                  <div
                    className={`grid_btn ${!this.state.grid ? "" : "active"}`}
                    onClick={() => this.handleGrid()}
                  >
                    <FontAwesomeIcon icon={faBars} />
                  </div>
                </div>
              </div>
              <div>
                <LoadmoreCarts
                  grid={this.state.grid}
                  limit={this.state.limit}
                  size={products.toShopSize}
                  products={products.toShop}
                  loadMore={() => this.loadMoreCarts()}
                />
              </div>
            </div>
          </div>
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

export default connect(mapStateToProps)(Shop);
