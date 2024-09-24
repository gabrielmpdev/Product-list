import React from 'react';
import ReactDOM from 'react-dom/client';
import ProductList from './components/ProductList';
import './styles/css/styles.css';
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <ProductList />
  </React.StrictMode>
);
