import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  <App />
  // </React.StrictMode>
);

// window.addEventListener("error", (e) => {
//   console.warn("🛑 Error capturado pero no mostrado en consola:", e.message);
//   e.preventDefault();
//   return false;
// });

// // 🔥 Intercepta promesas rechazadas sin catch()
// window.addEventListener("unhandledrejection", (e) => {
//   console.warn("⚠️ Promesa rechazada sin manejar:", e.reason);
//   e.preventDefault();
//   return false;
// });

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
