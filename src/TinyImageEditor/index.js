import React, { Component } from "react";
import PropTypes from "prop-types";
import DropZone from "react-dropzone";

import { red500 } from "material-ui/styles/colors";
import ErrorIcon from "material-ui/svg-icons/action/highlight-off";
import DeleteIcon from "material-ui/svg-icons/action/delete";
import EditIcon from "material-ui/svg-icons/image/edit";
import FlatButton from "material-ui/FlatButton";
import PhotoIcon from "material-ui/svg-icons/image/photo";
import EyeIcon from "material-ui/svg-icons/image/remove-red-eye";
import Dialog from "material-ui/Dialog";

import Cropper from "./Cropper";

const defaultDropZoneStyle = {
  position: "relative",
  width: "100%",
  textAlign: "center"
};

const defaultRootStyle = {
  width: "100%",
  height: "120px",
  fontWeight: "300",
  boxShadow: "0px 0px 8px 0px rgba(88, 57, 135, 0.8)",
  borderRadius: "10px",
  padding: "10px"
};

const styles = {
  root: defaultRootStyle,
  dropZone: defaultDropZoneStyle,
  dropZoneError: {
    ...defaultRootStyle,
    boxShadow: "0px 0px 8px 0px rgba(255,0, 0, 0.8)"
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
    this.editedImageFile = null;
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
    const { onFinishEdit } = this.props;
    if (rejected.length > 0) {
      this.setState({
        error: true,
        errorText: `This file exceeds ${maxSize}mb or the format is not supported ! Click here to choose another file.`
      });
    }
    if (rejected.length === 0 && accepted.length) {
      //Call onFinishEdit from parent
      onFinishEdit(accepted[0]);

      //Read image as data url
      this.fileReader.readAsDataURL(accepted[0]);
      this.setState({
        finalImageFile: accepted[0],
        error: false,
        errorText: ""
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
        <p
          style={{
            position: "relative",
            cursor: "pointer",
            top: "15px"
          }}
        >
          <ErrorIcon
            style={{ position: "relative", top: "5px" }}
            color={red500}
          />&nbsp;
          {errorText}
        </p>
      );
    } else if (finalImagePreview) {
      return (
        <div
          style={{
            position: "relative",
            top: "-15px"
          }}
        >
          <p
            style={{
              position: "relative",
              lineHeight: "-0.3rem",
              fontSize: 15,
              fontWeight: 300
            }}
          >
            <EyeIcon
              style={{
                position: "relative",
                width: 22,
                height: 22,
                top: 5
              }}
            />
            &nbsp;
            {label} Preview
          </p>
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
          cursor: "pointer"
        }}
      >
        <PhotoIcon
          style={{ width: 40, height: 40, top: 11, position: "relative" }}
        />
        Click here to select {label} image. Maximum File Size: {config.maxSize}{" "}
        MB
        <br />
        <span
          style={{
            fontFamily: "system-ui, sans-serif",
            fontweight: "100 !important",
            fontStyle: "italic",
            fontSize: "15px !important"
          }}
        >
          Recommended Size: {config.maxWidth}x{config.maxHeight}
        </span>
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
    const { editedImageFile } = this.state;
    // Perform final actions after image is cropped
    this.setState({
      showEditor: false,
      finalImageFile: this.editedImageFile,
      finalImagePreview: blobToUrl(this.editedImageFile)
    });
  }
  onEditComplete(editedImageFile) {
    this.editedImageFile = editedImageFile;
  }
  getEditorDialog() {
    const { config } = this;
    const { filename = "cropped_image" } = this.props;
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
          title={
            <div>
              <h4 style={{ margin: 0 }}>Edit Image</h4>
              <i style={{ fontSize: 14 }}>Click and drag to crop the image</i>
            </div>
          }
          actions={actions}
          modal={true}
          contentStyle={styles.editorDialog}
          open={showEditor}
        >
          <Cropper
            src={blobToUrl(finalImageFile)}
            onEditComplete={this.onEditComplete}
            maxWidth={config.maxWidth}
            maxHeight={config.maxHeight}
            filename={filename}
          />
        </Dialog>
      );
    }
    return null;
  }
  render() {
    const { config } = this;
    const { style: userStyle = {} } = this.props;
    const { error, errorText } = this.state;
    const rootStyle = error
      ? { ...styles.dropZoneError, ...userStyle }
      : { ...defaultRootStyle, ...userStyle };
    return (
      <div style={rootStyle}>
        <DropZone
          accept={config.accept}
          style={styles.dropZone}
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

TinyImageEditor.propTypes = {
  label: PropTypes.string,
  maxHeight: PropTypes.number,
  maxWidth: PropTypes.number,
  onFinishEdit: PropTypes.func.isRequired
};

export default TinyImageEditor;
