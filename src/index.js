import React from "react";
import ReactDOM from "react-dom";
import styles from "./App.css";
import TinyImageEditor from "./TinyImageEditor";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";

ReactDOM.render(
  <MuiThemeProvider>
    <div style={{ padding: "10%" }}>
      <TinyImageEditor
        label="Company Logo"
        config={{
          maxWidth: 300,
          maxHeight: 80,
          maxSize: 4,
        }}
      />
    </div>
  </MuiThemeProvider>,
  document.getElementById("root")
);
