import React, { Component } from "react";

import Header from "../components/Header_Footer/Header";
import { Footer } from "../components/Header_Footer/Footer";

import { connect } from "react-redux";
import { getSiteData } from "../actions/site_actions";

class Layout extends Component {
  componentDidMount() {
    //First we are checking that siteInfo exist in redux store/state?
    //If not then we are dispatching the action (means query from db)
    //Otherwise in every page load, this action must be dispatched...
    if (Object.keys(this.props.site).length === 0) {
      this.props.dispatch(getSiteData());
    }
  }

  render() {
    return (
      <div>
        <Header />
        <div className="page_container">{this.props.children}</div>
        <Footer siteData={this.props.site.siteData} />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    site: state.site,
  };
};

export default connect(mapStateToProps)(Layout);

//IMPORTANT: After adding "Site Info update" capability, first we thought about that
//inside the Footer component (Footer.js) retrieve info from state and show accordingly.
//But, Footer designed as a stateless component. So we changed our mind, and decided to use
//this Layout component to connect redux store/state, retrieve info and pass them to Footer
//as props. Because changing this Layout much much more easy. It's initially designed as
//class component.
