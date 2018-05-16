import React, { Component } from 'react';
import ReactCrop, { makeAspectCrop } from 'react-image-crop';
import DropZone from 'react-dropzone';
import "react-image-crop/lib/ReactCrop.scss";

class ImageCropper extends Component {
    constructor() {
        super();

        this.reader = null; // File reader to read image data
        this.cropped_area = null;  // Aread to append cropped image

        this.state = {
            rawImageElement: null,
            selectedImage: null,
            crop: {
                x: 20,
                y: 10,
                width: 200,
                height: 50,
            },
            finalCropConfig: null,
        };
        this.onCropFinish = this.onCropFinish.bind(this);
        this.handleCrop = this.handleCrop.bind(this);
        this.getCroppedImage = this.getCroppedImage.bind(this);
        this.onImageLoadComplete = this.onImageLoadComplete.bind(this);
        this.handleFileDrop = this.handleFileDrop.bind(this);
        this.reader = null;
    }
    componentDidMount() {
        this.reader = new FileReader();
        this.reader.onload = () => {
            this.setImageData(this.reader.result);
        }
        this.reader.onerror = () => {
            console.error(`[TIM] Something went wrong while reading image`);
        }
    }
    handleFileDrop(files) {
        const imageFile = files[0];
        this.reader.readAsDataURL(imageFile);
    }
    onImageLoadComplete(imageEle) {
        this.setState({
            rawImageElement: imageEle,
            crop: makeAspectCrop({
                x: 0,
                y: 0,
                aspect: 16 / 9,
            }, imageEle.width / imageEle.height),
        });
    }
    onCropFinish(crop, pixelCrop) {
        this.setState({
            finalCropConfig: pixelCrop,
        });
    }
    setImageData(base64Data) {
        this.setState({
            selectedImage: base64Data,
        })
    }
    handleCrop(crop) {
        this.setState({
            crop,
        });
    }
    static download(dataurl, filename) {
        var a = document.createElement("a");
        a.href = dataurl;
        a.setAttribute("download", filename);
        var b = document.createEvent("MouseEvents");
        b.initEvent("click", false, true);
        a.dispatchEvent(b);
        return false;
    }
    getCroppedImage(image, fileName = 'cropped_image') {
        const { rawImageElement } = this.state;
        const { x, y, width, height } = this.state.finalCropConfig;
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = "white";
        ctx.fill();
        ctx.drawImage(
            rawImageElement,
            x,
            y,
            width,
            height,
            0,
            0,
            300,
            300,
        );
        return new Promise((resolve, reject) => {
            canvas.toBlob(file => {
                file.name = fileName;
                resolve(file);
                //Set the final cropped image
                const image_preview = document.createElement('IMG');
                image_preview.setAttribute('src', URL.createObjectURL(file));
                image_preview.setAttribute('height', height);
                image_preview.setAttribute('width', width);
                image_preview.setAttribute('alt', 'Image Preview');
                this.cropped_area.appendChild(image_preview);
            }, 'image/jpeg');
        });
    }
    render() {
        return (
            <div>
                <DropZone
                    multiple={false}
                    onDrop={this.handleFileDrop}
                    style={{
                        width: "100%",
                        height: '40px',
                        border: '1px dotted grey',
                        textAlign: 'center',
                        padding: '30px',
                    }}
                >
                    <div>Please drop the signature file here</div>
                </DropZone>
                <br />
                <br />
                {
                    this.state.selectedImage ?
                        <div>
                            <ReactCrop
                                src={this.state.selectedImage}
                                onChange={this.handleCrop}
                                onImageLoaded={this.onImageLoadComplete}
                                onComplete={this.onCropFinish}
                                style={{
                                    height: 300,
                                    width: 300,
                                    background: 'white',
                                    overflow: 'auto',
                                }}
                                crop={this.state.crop}
                                crossorigin="*"
                            />
                            <button onClick={this.getCroppedImage}>Save</button>
                            <div ref={(ele) => this.cropped_area = ele}></div>
                        </div> : null
                }
            </div>
        )
    }
}

export default ImageCropper;