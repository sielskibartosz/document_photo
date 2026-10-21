import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import i18n from "./i18n";

// Stare adresy z "#/..." (zakładki, reklamy, powrót ze Stripe) przepisujemy na zwykłe ścieżki,
// zanim wystartuje router - bez przeładowania strony
if (window.location.hash.startsWith("#/")) {
  const [hashPath, hashQuery] = window.location.hash.slice(1).split("?");
  const params = new URLSearchParams(window.location.search);
  new URLSearchParams(hashQuery).forEach((value, key) => params.set(key, value));
  const query = params.toString();
  window.history.replaceState(null, "", hashPath + (query ? `?${query}` : ""));
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
