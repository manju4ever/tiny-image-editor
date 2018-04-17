import React from  'react';
import ReactDOM from 'react-dom';
import styles from "./App.css";

const App = (props) => <div className={styles.root}>
        <h2> Hello { props.name ? props.name : 'World' } ! </h2>
</div>;

ReactDOM.render(<App name="Buddy"/>, document.getElementById('root'));
