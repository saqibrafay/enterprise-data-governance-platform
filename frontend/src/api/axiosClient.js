import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:8000',
  headers: { 'Content-Type': 'application/json' },
});

// We can't import the Redux store directly here because that would create a
// circular dependency: store → authSlice → axiosClient → store.
// Instead, index.js calls injectStore(store) after everything initialises,
// and the interceptor reads from the injected reference at request time.
let _store;
export const injectStore = (store) => {
  _store = store;
};

// Attach the JWT from Redux state to every outgoing request.
// This runs on every request, so it always uses the current token
// (works correctly after login, and skips the header when logged out).
axiosClient.interceptors.request.use((config) => {
  const token = _store?.getState()?.auth?.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosClient;
