//class-based because we are going to use state
import React, { Component } from "react";

export default class prodImg extends Component {
  state = {
    lightbox: false,
    imagePos: 0,
    lightboxImages: [],
  };

  componentDidMount() {
    const prodImgs = this.props.detail.images;
    if (prodImgs.length > 0) {
      let lightboxImages = [];

      prodImgs.forEach((img) => {
        lightboxImages.push(img.url);
      });

      this.setState({
        lightboxImages,
      });
    }
  }

  renderCardImage = (imgs) => {
    if (imgs.length > 0) {
      return imgs[0].url;
    } else {
      return "images/image_not_available.png";
    }
  };

  handleLightBox = (idx) => {};

  showThumbs = () =>
    this.state.lightboxImages.map((img, i) =>
      i > 0 ? (
        <div
          key={i}
          onClick={() => this.handleLightBox(i)}
          className="thumb"
          style={{ background: `url(${img}) no-repeat` }}
        ></div>
      ) : null
    );

  render() {
    console.log(this.state);
    const { detail } = this.props;
    return (
      <div className="product_image_container">
        <div className="main_pic">
          <div
            style={{
              background: `url(${this.renderCardImage(
                detail.images
              )}) no-repeat`,
            }}
            onClick={() => this.handleLightBox(0)}
          ></div>
        </div>
        <div className="main_thumbs">{this.showThumbs()}</div>
      </div>
    );
  }
}
