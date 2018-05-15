import React from 'react';
import ReactDOM from 'react-dom';
import styles from "./App.css";
import TinyImageEditor from "./TinyImageEditor";
import App from "./App";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

ReactDOM.render(<MuiThemeProvider>
    <TinyImageEditor label="Company Logo" placeholder="Click here to select or drop  a 200x200 company logo here" />
</MuiThemeProvider>, document.getElementById('root'));
