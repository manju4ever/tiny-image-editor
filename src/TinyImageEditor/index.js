import React, { Component } from "react";
import PropTypes from "prop-types";
import DropZone from 'react-dropzone';
import "react-image-crop/lib/ReactCrop.scss";

import { red500 } from 'material-ui/styles/colors';
import ErrorIcon from "material-ui/svg-icons/action/highlight-off";
import DeleteIcon from "material-ui/svg-icons/action/delete";
import EditIcon from "material-ui/svg-icons/image/edit";
import FlatButton from "material-ui/FlatButton";


import "./app.scss";


const defaultDropZoneStyle = {
    position: 'relative',
    width: "100%",
    textAlign: 'center',
};

const styles = {
    root: {
        width: '95%',
        height: '120px',
        fontWeight: '300',
        boxSizing: 'border-box',
        border: '2px dotted purple',
        borderRadius: '10px',
        padding: '10px',
    },
    dropZone: defaultDropZoneStyle,
    dropZoneError: {
        ...defaultDropZoneStyle,
    },
};

const defaultEditorConfig = {
    accept: "image/jpeg, image/png, image/jpg", // default MIME types
    maxSize: 4, // in mb
    maxHeight: 80,
    maxWidth: 300,
};

class TinyImageEditor extends Component {
    constructor(props) {
        super();
        this.config = {
            ...defaultEditorConfig,
            ...props.config,
        };
        this.fileReader = null;
        this.state = {
            placeholder: props.placeholder || `Please select or drop an image file`,
            finalImageFile: null,
            finalImagePreview: null,
            dropZone: {
                error: false,
                errorText: null,
            },
            reactCrop: {

            },
        };
        this.showSelectionPreview = this.showSelectionPreview.bind(this);
        this.showActionButtons = this.showActionButtons.bind(this);
        this.displayEditor = this.displayEditor.bind(this);
        this.resetAll = this.resetAll.bind(this);

        this.dzOnDrop = this.dzOnDrop.bind(this);
    }
    componentDidMount() {
        this.fileReader = new FileReader();
        this.fileReader.addEventListener('load', () => {
            this.setState({
                finalImagePreview: this.fileReader.result,
            });
        });
    }
    dzOnDrop(accepted, rejected) {
        const { maxSize } = this.config;
        if (rejected.length > 0) {
            this.setState({
                error: true,
                errorText: `This file exceeds ${maxSize}mb or the format is not supported ! Click here to choose another file.`,
            });
        }
        if (rejected.length === 0 && accepted.length) {
            //Read image as data url
            this.fileReader.readAsDataURL(accepted[0]);
            this.setState({
                finalImageFile: accepted[0],
            });
        }
    }
    showSelectionPreview() {
        const { config } = this;
        const { label = "Image" } = this.props;
        const { error, errorText, placeholder, finalImageFile, finalImagePreview } = this.state;
        if (error && errorText) {
            return <p>
                <ErrorIcon style={{ position: 'relative', top: "5px" }} color={red500} />&nbsp;
                {errorText}
            </p>
        } else if (finalImagePreview) {
            return <div>
                <p><i>{label} Preview</i></p>
                <img src={finalImagePreview} height={config.maxHeight} width={config.maxWidth} alt="Preview Not Available" />
            </div>
        }
        return <p style={{ cursor: 'pointer', position: 'relative' }}>
            {placeholder}
        </p>
    }
    resetAll() {
        this.setState({
            finalImageFile: null,
            finalImagePreview: null,
        });
    }
    showActionButtons() {
        const { error, finalImagePreview } = this.state;
        if (error) return null;
        if (finalImagePreview) return <div style={{ position: 'absolute', right: 0, top: "-30px" }}>
            <FlatButton onClick={this.displayEditor} style={{ fontSize: 8 }} primary={true} icon={<EditIcon />} />
            <FlatButton onClick={this.resetAll} style={{ fontSize: 8 }} secondary={true} icon={<DeleteIcon />} />
        </div>
        return null;
    }
    displayEditor() {

    }
    render() {
        const { config } = this;
        const { error, errorText } = this.state;
        return (
            <div style={styles.root}>
                <DropZone
                    accept={config.accept}
                    style={error ? styles.dropZoneError : styles.dropZone}
                    onDrop={this.dzOnDrop}
                    maxSize={config.maxSize * 1024 * 1024}
                >
                    <div>
                        {this.showSelectionPreview()}
                    </div>
                </DropZone>
                <div style={{ position: 'relative', height: '100%' }}>
                    {this.showActionButtons()}
                </div>
            </div>
        );
    }
}

export default TinyImageEditor;