import React, { Component } from "react";

//Previously "Lightbox" class exists in the react-images
//it changed to Carousel
import Carousel, { Modal, ModalGateway } from "react-images";

export default class ImageLightBox extends Component {
  state = {
    lightboxIsOpen: true,
    currentImage: this.props.pos,
    images: [],
  };

  static getDerivedStateFromProps(props, state) {
    if (props.images) {
      const images = [];
      props.images.forEach((img) => {
        //images.push({ src: `${img}` });
        images.push({ source: `${img}` });
      });
      return (state = {
        images,
      });
    }
    return false;
  }

  gotoPrevious = () => {
    this.setState({
      currentImage: this.state.currentImage - 1,
    });
  };

  gotoNext = () => {
    this.setState({
      currentImage: this.state.currentImage + 1,
    });
  };

  closeLightbox = () => {
    this.props.onClose();
  };

  render() {
    // return (
    //   <Lightbox
    //     currentImage={this.state.currentImage}
    //     images={this.state.images}
    //     isOpen={this.state.lightboxIsOpen}
    //     onClickPrev={() => this.gotoPrevious()}
    //     onClickNext={() => this.gotoNext()}
    //     onClose={() => this.closeLightbox()}
    //   />
    // );
    //return <Carousel views={this.state.images} />;

    return (
      <ModalGateway>
        {this.state.lightboxIsOpen ? (
          <Modal onClose={() => this.closeLightbox()}>
            <Carousel views={this.state.images} />
          </Modal>
        ) : null}
      </ModalGateway>
    );
  }
}
