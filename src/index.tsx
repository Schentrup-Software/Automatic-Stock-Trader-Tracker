import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import CssBaseline from "@material-ui/core/CssBaseline"
import {
    MuiThemeProvider,
    createMuiTheme,
    Theme,
} from "@material-ui/core/styles"
import { blue, orange } from "@material-ui/core/colors"

const theme: Theme = createMuiTheme({
    palette: {
        primary: blue, //CG Blue: #0019E6
        secondary: orange, //CG Orange: #F0400D
    },
})

ReactDOM.render(
  <>
      <CssBaseline />
      <MuiThemeProvider theme={theme}>
        <React.StrictMode>
          <App />
        </React.StrictMode>
      </MuiThemeProvider>
  </>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
