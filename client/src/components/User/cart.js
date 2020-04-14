//in the redux state, we have user > userData > cart
//but in this cart does not contain all information about the products
//So we gonna use this data to fetch other missing data to show the list of products in the cart

import React, { Component } from "react";
import UserLayout from "../../hoc/user_layout";

import { connect } from "react-redux";
import { getCartItems } from "../../actions/user_actions";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import faFrown from "@fortawesome/fontawesome-free-solid/faFrown";
import faSmile from "@fortawesome/fontawesome-free-solid/faSmile";

import { UserProductBlock } from "../utils/User/product_block";

class UserCart extends Component {
  state = {
    loading: true,
    total: 0,
    showTotal: false,
    showSuccess: false,
  };

  componentDidMount() {
    let cartProdIds = [];
    //in order to access "this.props" we used mapStateToProps
    let user = this.props.user;
    let cart = user.userData.cart;

    if (cart) {
      if (cart.length > 0) {
        cart.forEach((item) => {
          cartProdIds.push(item.id);
        });

        this.props.dispatch(getCartItems(cartProdIds, cart));
        //.then(() => {});
      }
    }
  }

  removeFromCart = () => {};

  //be careful:
  //strange... "users" send to UserProductBlock as "products"
  render() {
    return (
      <UserLayout>
        <div>
          <h1>My Cart</h1>
          <div className="user_cart">
            <UserProductBlock
              products={this.props.user}
              type="cart"
              removeItem={(id) => this.removeFromCart(id)}
            />
          </div>
        </div>
      </UserLayout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps)(UserCart);
