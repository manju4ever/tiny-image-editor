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
        width: '100%',
        height: '80px',
        fontWeight: '200',
        boxSizing: 'border-box',
        border: '2px dotted purple',
        padding: '10px',
    },
    dropZone: defaultDropZoneStyle,
    dropZoneError: {
        ...defaultDropZoneStyle,
    },
};

const defaultEditorConfig = {
    accept: "image/jpeg, image/png, image/jpg",
    maxSize: 4, //4 mb max size
};

class TinyImageEditor extends Component {
    constructor(props) {
        super();
        this.config = {
            ...defaultEditorConfig,
            ...props.config,
        };
        this.state = {
            placeholder: props.placeholder || `Please select or drop an image file`,
            finalImage: null,
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
    showSelectionPreview() {
        const { error, errorText, placeholder, finalImage } = this.state;
        if (error && errorText) {
            return <p>
                <ErrorIcon style={{ position: 'relative', top: "5px" }} color={red500} />&nbsp;
                {errorText}
            </p>
        } else if (finalImage) {
            return <h4>
                Image Preview Goes Here !
            </h4>
        }
        return <p style={{ cursor: 'pointer' }}>
            {placeholder}
        </p>
    }
    showActionButtons() {
        const { error } = this.state;
        if (error) return null;
        if (this.finalImage) return <div style={{ position: 'absolute', right: 0, top: "3px" }}>
            <FlatButton onClick={this.displayEditor} style={{ fontSize: 8 }} primary={true} icon={<EditIcon />} />
            <FlatButton onClick={this.resetAll} style={{ fontSize: 8 }} secondary={true} icon={<DeleteIcon />} />
        </div>
        return null;
    }
    displayEditor() {

    }
    resetAll() {

    }
    dzOnDrop(accepted, rejected) {
        console.log(accepted, rejected);
        const { maxSize } = this.config;
        if (rejected.length > 0) {
            this.setState({
                error: true,
                errorText: `This file exceeds ${maxSize}mb or the format is not supported !`,
            });
        }
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