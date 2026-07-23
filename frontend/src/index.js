import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './store/store';
import { injectStore } from './api/axiosClient';
import App from './App';
import './index.css';

// Wire the store into axiosClient AFTER both modules are fully initialised.
// This is the standard pattern to break the store → authSlice → axiosClient → store
// circular dependency without using localStorage.
injectStore(store);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
