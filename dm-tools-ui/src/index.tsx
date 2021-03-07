import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { createOvermind } from 'overmind';
import { Provider } from 'overmind-react';
// import reportWebVitals from './reportWebVitals';

import { config } from './overmind';
const overmind = createOvermind(config);

ReactDOM.render(
  <Provider value={overmind}>
    <App />
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
