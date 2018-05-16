import React, { Component } from "react";
import "react-image-crop/lib/ReactCrop.scss";

import ReactCrop, { makeAspectCrop } from "react-image-crop";
import ErrorIcon from "material-ui/svg-icons/action/highlight-off";

class Cropper extends Component {
  constructor() {
    super();
    this.cropped_preview = null;
    this.state = {
      rawImageElement: null,
      crop: {
        x: 5,
        y: 15,
        width: 200,
        height: 50
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
      imageElement,
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
    console.log(pixelCrop);
    this.setState({
      finalCropConfig: pixelCrop
    });
  }
  handleCrop(crop) {
    this.setState({
      crop
    });
  }
  getCroppedImage() {
    const { rawImageElement } = this.state;
    const { x, y, width, height } = this.state.finalCropConfig;
    console.log(x, y, width, height);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.drawImage(rawImageElement, x, y, width, height, 0, 0, 300, 300);
    return new Promise((resolve, reject) => {
      canvas.toBlob(file => {
        file.name = fileName;
        resolve(file);
        //Set the final cropped image
        const image_preview = document.createElement("IMG");
        image_preview.setAttribute("src", URL.createObjectURL(file));
        image_preview.setAttribute("height", height);
        image_preview.setAttribute("width", width);
        image_preview.setAttribute("alt", "Image Preview");
        this.cropped_preview.appendChild(image_preview);
      }, "image/jpeg");
    });
  }
  render() {
    const { src = null, onEditComplete } = this.props;
    const { crop } = this.state;
    return (
      <div
        style={{
          textAlign: "center",
          width: "100%",
          height: 300,
          margin: "0 auto",
          border: "2px dotted grey"
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
              background: "white",
              overflow: "auto"
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
