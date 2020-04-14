//in the redux state, we have user > userData > cart
//but in this cart does not contain all information about the products
//So we gonna use this data to fetch other missing data to show the list of products in the cart

import React, { Component } from "react";
import UserLayout from "../../hoc/user_layout";

import { connect } from "react-redux";
import {
  getCartItems,
  removeCartItem,
  onSuccessBuy,
} from "../../actions/user_actions";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import faFrown from "@fortawesome/fontawesome-free-solid/faFrown";
import faSmile from "@fortawesome/fontawesome-free-solid/faSmile";

import { UserProductBlock } from "../utils/User/product_block";

import Paypal from "../utils/paypal";

class UserCart extends Component {
  state = {
    loading: true,
    total: 0,
    showTotal: false,
    showSuccess: false,
  };

  calculateTotal = (cartDetail) => {
    let total = 0;

    cartDetail.forEach((item) => {
      total += parseInt(item.price, 10) * item.quantity;
    });

    this.setState({
      total,
      showTotal: true,
    });
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

        //this.props.dispatch(getCartItems(cartProdIds, cart));
        this.props.dispatch(getCartItems(cartProdIds, cart)).then(() => {
          let cartDetail = this.props.user.cartDetail;
          if (cartDetail.length > 0) {
            this.calculateTotal(cartDetail);
          }
        });
      }
    }
  }

  removeFromCart = (id) => {
    this.props.dispatch(removeCartItem(id)).then(() => {
      if (this.props.user.cartDetail.length <= 0) {
        this.setState({ showTotal: false });
      } else {
        this.calculateTotal(this.props.user.cartDetail);
      }
    });
  };

  showNoItemMessage = () => (
    <div className="cart_no_items">
      <FontAwesomeIcon icon={faFrown} />
      <div>You have no items in your cart!</div>
    </div>
  );

  showSuccessMessage = () => (
    <div className="cart_no_items">
      <FontAwesomeIcon icon={faSmile} />
      <div>Thank you for your order...</div>
    </div>
  );

  transactionError = (paymentData) => {
    console.log("Paypal error!", paymentData);
  };

  transactionCanceled = (paymentData) => {
    console.log("Transaction cancelled!", paymentData);
  };

  transactionSuccess = (paymentData) => {
    //console.log(data);

    //since onSuccessBuy(data) function defined as accepting only one parameter "data" as you seen in the user_actions.js
    //so, in order to send just one parameter we are packing cartDetail and cartDetail as a single object when sending/dispatching to the onSuccess user action
    this.props
      .dispatch(
        onSuccessBuy({
          cartDetail: this.props.user.cartDetail,
          paymentData: paymentData,
        })
      )
      .then(() => {
        //successBuy comes from the ON_SUCCESS_BUY_USER user reducer
        if (this.props.user.successBuy) {
          this.setState({
            showTotal: false,
            showSuccess: true,
          });
        }
      });
  };

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
            {this.state.showTotal ? (
              <div>
                <div className="user_cart_sum">
                  <div>Total amount: $ {this.state.total}</div>
                </div>
              </div>
            ) : this.state.showSuccess ? (
              this.showSuccessMessage()
            ) : (
              this.showNoItemMessage()
            )}
          </div>
          {this.state.showTotal ? (
            <div className="paypal_button_container">
              <Paypal
                toPay={this.state.total}
                transactionError={(data) => this.transactionError(data)}
                transactionCanceled={(data) => this.transactionCanceled(data)}
                onSuccess={(data) => this.transactionSuccess(data)}
              />
            </div>
          ) : null}
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
