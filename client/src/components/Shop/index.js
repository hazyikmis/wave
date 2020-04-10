import React, { Component } from "react";
import { PageTop } from "../utils/page_top";
import { connect } from "react-redux";

import { getBrands, getWoods } from "../../actions/products_actions";

import CollapsableCheckBoxList from "../utils/collapse_checkbox";

import { frets } from "../utils/Form/fixed_categories";

class Shop extends Component {
  state = {
    grid: "",
    limit: 6,
    skip: 0,
    filters: {
      brands: [],
      frets: [],
      woods: [],
      price: [],
    },
  };

  componentDidMount() {
    this.props.dispatch(getBrands());
    this.props.dispatch(getWoods());
  }

  handleFilters = (filters, category) => {
    //on every-click, "filters" contains the array of only selected brands or only selected frest or only selected woods
    //so, when handling all filters together we need to use state (until that moment, for this class we had not need any state)
    //console.log(filters, category);
    const newFilters = { ...this.state.filters };
    newFilters[category] = filters;
    this.setState({
      filters: newFilters,
    });
    //if you want to follow the change in the state, you need to
    //put console.log(this.state) just at the beginning of render function
  };

  render() {
    console.log(this.state.filters);

    const products = this.props.products;

    //BE CAREFUL: brands & woods comes from mongodb, but frets comes from mongodb-like fixed array of objects
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
                  this.handleFilters(filters, "brands")
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
                handleFilters={(filters) =>
                  this.handleFilters(filters, "woods")
                }
              />
            </div>
            <div className="right">right</div>
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
