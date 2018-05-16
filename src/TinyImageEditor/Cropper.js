import React, { Component } from "react";
import "react-image-crop/lib/ReactCrop.scss";

import ReactCrop, { makeAspectCrop } from "react-image-crop";
import ErrorIcon from "material-ui/svg-icons/action/highlight-off";

class Cropper extends Component {
  constructor(props) {
    super();
    this.cropped_preview = null;
    this.state = {
      rawImageElement: null,
      crop: {
        x: 5,
        y: 15,
        width: 200,
        height: 50,
      },
      finalCropConfig: null
    };
    this.handleCrop = this.handleCrop.bind(this);
    this.onImageLoadComplete = this.onImageLoadComplete.bind(this);
    this.onCropFinish = this.onCropFinish.bind(this);
    this.getCroppedImage = this.getCroppedImage.bind(this);
  }
  onImageLoadComplete(imageElement) {
    this.setState({
      rawImageElement: imageElement,
      crop: makeAspectCrop(
        {
          x: 5,
          y: 15,
          aspect: 16 / 9
        },
        imageElement.width / imageElement.height
      )
    });
  }
  onCropFinish(crop, pixelCrop) {
    const { onEditComplete } = this.props;
    this.setState({
      finalCropConfig: pixelCrop,
    });
    this.getCroppedImage().then(editedImage => {
      onEditComplete(editedImage);
    }).catch(err => {
      console.error(`[TIM] Something went wrong on saving crooped image.`);
    });
  }
  handleCrop(crop) {
    this.setState({
      crop
    });
  }
  getCroppedImage() {
    const { filename = 'cropped_image' } = this.props;
    const { rawImageElement } = this.state;
    const { x, y, width, height } = this.state.finalCropConfig;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.drawImage(rawImageElement, x, y, width, height, 0, 0, 300, 300);
    return new Promise((resolve, reject) => {
      canvas.toBlob(file => {
        file.name = filename;
        resolve(file);
      }, "image/jpeg");
    });
  }
  render() {
    const { src = null, maxHeight = 768, maxWidth = 1334 } = this.props;
    const { crop } = this.state;
    return (
      <div
        style={{
          textAlign: "center",
          width: "100%",
          height: 300,
          margin: "0 auto",
        }}
      >
        {src ? (
          <ReactCrop
            src={src}
            onChange={this.handleCrop}
            onImageLoaded={this.onImageLoadComplete}
            onComplete={this.onCropFinish}
            style={{
              height: "100%",
              width: 600,
              backgroundSize: "40px 40px",
              top: "2px",
              overflow: "auto",
              boxShadow: "0px 0px 1px 1px rgba(0,0,0,0.2)",
              borderRadius: '5px',
              background: "white",
            }}
            crop={crop}
            crossorigin="*"
          />
        ) : (
            <h4>
              <ErrorIcon />Unable to find an image source !
          </h4>
          )}
        <div ref={ele => (this.cropped_preview = ele)} />
      </div>
    );
  }
}

export default Cropper;
