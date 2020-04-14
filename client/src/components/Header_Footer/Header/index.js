import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { logoutUser } from "../../../actions/user_actions";

class Header extends Component {
  state = {
    page: [
      {
        name: "Home",
        linkTo: "/",
        public: true,
      },
      {
        name: "Guitars",
        linkTo: "/shop",
        public: true,
      },
    ],
    user: [
      {
        name: "My cart",
        linkTo: "/user/cart",
        public: false,
      },
      {
        name: "My account",
        linkTo: "/user/dashboard",
        public: false,
      },
      {
        name: "Log in",
        linkTo: "/register_login",
        public: true,
      },
      {
        name: "Log out",
        linkTo: "/users/logout",
        public: false,
      },
    ],
  };

  logoutHandler = () => {
    this.props.dispatch(logoutUser()).then((response) => {
      if (response.payload.success) {
        //in order to use "history" we imported "withRouter" from "react-router-dom"
        this.props.history.push("/");
      }
    });
  };

  cartLink = (item, i) => {
    const user = this.props.user.userData;

    return (
      <div className="cart_link" key={i}>
        <span>{user.cart ? user.cart.length : 0}</span>
        <Link to={item.linkTo}>{item.name}</Link>
      </div>
    );
  };

  defaultLink = (item, i) =>
    item.name === "Log out" ? (
      <div
        className="log_out_link"
        key={i}
        onClick={() => this.logoutHandler()}
      >
        {item.name}
      </div>
    ) : (
      <Link to={item.linkTo} key={i}>
        {item.name}
      </Link>
    );

  showLinks = (linkType) => {
    let list = [];

    if (this.props.user.userData) {
      linkType.forEach((item) => {
        if (!this.props.user.userData.isAuth) {
          if (item.public) {
            list.push(item);
          }
        } else {
          if (item.name !== "Log in") {
            list.push(item);
          }
        }
      });
    }
    return list.map((item, i) => {
      if (item.name !== "My cart") {
        return this.defaultLink(item, i);
      } else {
        return this.cartLink(item, i);
      }
    });
  };

  render() {
    return (
      <header className="bck_b_light">
        <div className="container">
          <div className="right">
            <div className="top">{this.showLinks(this.state.user)}</div>
            <div className="bottom">{this.showLinks(this.state.page)}</div>
          </div>
          <div className="left">
            <div className="logo">WAVES</div>
          </div>
        </div>
      </header>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps)(withRouter(Header));
