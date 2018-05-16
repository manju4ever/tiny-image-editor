import React, { Component } from "react";
import PropTypes from "prop-types";
import DropZone from "react-dropzone";

import { red500 } from "material-ui/styles/colors";
import ErrorIcon from "material-ui/svg-icons/action/highlight-off";
import DeleteIcon from "material-ui/svg-icons/action/delete";
import EditIcon from "material-ui/svg-icons/image/edit";
import FlatButton from "material-ui/FlatButton";
import PhotoIcon from "material-ui/svg-icons/image/photo";
import Dialog from "material-ui/Dialog";

import "./app.scss";
import Cropper from "./Cropper";

const defaultDropZoneStyle = {
  position: "relative",
  width: "100%",
  textAlign: "center"
};

const styles = {
  root: {
    width: "100%",
    height: "120px",
    fontWeight: "300",
    border: "2px dotted purple",
    borderRadius: "10px",
    padding: "10px"
  },
  dropZone: defaultDropZoneStyle,
  dropZoneError: {
    ...defaultDropZoneStyle
  },
  editorDialog: {
    width: 600
  }
};

const defaultEditorConfig = {
  accept: "image/jpeg, image/png, image/jpg", // default MIME types
  maxSize: 1, // in mb
  maxHeight: 80,
  maxWidth: 300
};

const blobToUrl = blob => {
  var url = window.URL || window.webkitURL;
  return url.createObjectURL(blob);
};
class TinyImageEditor extends Component {
  constructor(props) {
    super();
    this.config = {
      ...defaultEditorConfig,
      ...props.config
    };
    this.fileReader = null;
    this.state = {
      placeholder: props.placeholder || `Please select or drop an image file`,
      finalImageFile: null,
      finalImagePreview: null,
      dropZone: {
        error: false,
        errorText: null
      },
      reactCrop: {},
      showEditor: false
    };
    this.showSelectionPreview = this.showSelectionPreview.bind(this);
    this.showActionButtons = this.showActionButtons.bind(this);
    this.resetAll = this.resetAll.bind(this);
    this.openEditor = this.openEditor.bind(this);
    this.handleEditorClose = this.handleEditorClose.bind(this);
    this.handleEditorSave = this.handleEditorSave.bind(this);
    this.getEditorDialog = this.getEditorDialog.bind(this);
    this.onEditComplete = this.onEditComplete.bind(this);

    this.dzOnDrop = this.dzOnDrop.bind(this);
  }
  componentDidMount() {
    this.fileReader = new FileReader();
    this.fileReader.addEventListener("load", () => {
      this.setState({
        finalImagePreview: this.fileReader.result
      });
    });
  }
  dzOnDrop(accepted, rejected) {
    const { maxSize } = this.config;
    if (rejected.length > 0) {
      this.setState({
        error: true,
        errorText: `This file exceeds ${maxSize}mb or the format is not supported ! Click here to choose another file.`
      });
    }
    if (rejected.length === 0 && accepted.length) {
      //Read image as data url
      this.fileReader.readAsDataURL(accepted[0]);
      this.setState({
        finalImageFile: accepted[0]
      });
    }
  }
  showSelectionPreview() {
    const { config } = this;
    const { label = "Image" } = this.props;
    const {
      error,
      errorText,
      placeholder,
      finalImageFile,
      finalImagePreview
    } = this.state;
    if (error && errorText) {
      return (
        <p>
          <ErrorIcon
            style={{ position: "relative", top: "5px" }}
            color={red500}
          />&nbsp;
          {errorText}
        </p>
      );
    } else if (finalImagePreview) {
      return (
        <div>
          <h5 style={{ lineHeight: "0.3px" }}>{label} Preview</h5>
          <img
            src={finalImagePreview}
            height={config.maxHeight}
            width={config.maxWidth}
            alt="Preview Not Available"
          />
        </div>
      );
    }
    return (
      <p
        style={{
          cursor: "pointer",
          position: "relative",
          top: "20px",
          fontSize: 17,
          fontWeight: 100
        }}
      >
        Click here or drop an Image {label} of {config.maxWidth}x{
          config.maxHeight
        }{" "}
        of size upto {config.maxSize}MB.
      </p>
    );
  }
  resetAll() {
    this.setState({
      finalImageFile: null,
      finalImagePreview: null
    });
  }
  showActionButtons() {
    const { error, finalImagePreview } = this.state;
    if (error) return null;
    if (finalImagePreview)
      return (
        <div style={{ position: "absolute", right: 0 }}>
          <FlatButton
            onClick={this.openEditor}
            style={{ fontSize: 8 }}
            primary={true}
            icon={<EditIcon />}
          />
          <FlatButton
            onClick={this.resetAll}
            style={{ fontSize: 8 }}
            secondary={true}
            icon={<DeleteIcon />}
          />
        </div>
      );
    return null;
  }
  openEditor() {
    this.setState({
      showEditor: true
    });
  }
  handleEditorClose() {
    this.setState({
      showEditor: false
    });
  }
  handleEditorSave() {
    // Perform final actions after image is cropped
    this.setState({
      showEditor: false
    });
  }
  onEditComplete() {
    console.log(`Im being Called !`);
  }
  getEditorDialog() {
    const { showEditor, finalImageFile } = this.state;
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.handleEditorClose}
      />,
      <FlatButton label="Save" primary={true} onClick={this.handleEditorSave} />
    ];
    if (showEditor) {
      return (
        <Dialog
          title="Edit Image"
          actions={actions}
          modal={true}
          contentStyle={styles.editorDialog}
          open={showEditor}
        >
          <Cropper
            src={blobToUrl(finalImageFile)}
            onEditComplete={this.onEditComplete}
          />
        </Dialog>
      );
    }
    return null;
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
          <div sytle={{ boxSizing: "border-box" }}>
            {this.showSelectionPreview()}
          </div>
        </DropZone>
        <div style={{ position: "relative" }}>{this.showActionButtons()}</div>
        {this.getEditorDialog()}
      </div>
    );
  }
}

export default TinyImageEditor;
