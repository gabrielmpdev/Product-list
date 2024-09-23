import React, { useState } from 'react';
import { Product } from '../types';
import products from '../data.json';
import styles from '../styles/scss/styles.scss';

const ProductList: React.FC = () => {
  const [cart, setCart] = useState<{ name: string; quantity: number }[]>([]);
  const [addedProducts, setAddedProducts] = useState<{ [key: string]: number }>({});

  const addToCart = (productName: string) => {
    setAddedProducts(prev => ({ ...prev, [productName]: (prev[productName] || 0) + 1 }));
    
    // Verifica se o produto já está no cart
    setCart(prevCart => {
      const existingProduct = prevCart.find(item => item.name === productName);
      if (existingProduct) {
        return prevCart.map(item =>
          item.name === productName
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { name: productName, quantity: 1 }];
    });
  };

  const increaseQuantity = (productName: string) => {
    setAddedProducts(prev => ({ ...prev, [productName]: prev[productName] + 1 }));
    
    // Atualiza o minicart
    setCart(prevCart => {
      return prevCart.map(item =>
        item.name === productName
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    });
  };

  const decreaseQuantity = (productName: string) => {
    setAddedProducts(prev => {
      const newQuantity = prev[productName] - 1;
      if (newQuantity <= 0) {
        removeFromCart(productName);
        return { ...prev, [productName]: 0 };
      }
      return { ...prev, [productName]: newQuantity };
    });
    
    // Atualiza o minicart
    setCart(prevCart => {
      return prevCart.map(item =>
        item.name === productName && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
    });
  };

  const removeFromCart = (productName: string) => {
    setCart(prevCart => prevCart.filter(item => item.name !== productName));
    setAddedProducts(prev => {
      const { [productName]: _, ...rest } = prev;
      return rest;
    });
  };

  return (
    <div>
      <h1 className={styles.titeListe}>Product List</h1>
      <ul>
        {products.map((product: Product) => (
          <li key={product.name}>
            <img src={product.image.thumbnail} alt={product.name} />
            <h2>{product.name}</h2>
            <p>Category: {product.category}</p>
            <p>Price: ${product.price.toFixed(2)}</p>

            {!addedProducts[product.name] ? (
              <button onClick={() => addToCart(product.name)}>Add to Cart</button>
            ) : (
              <div>
                <button onClick={() => increaseQuantity(product.name)}>+</button>
                <button onClick={() => decreaseQuantity(product.name)}>-</button>
                <span> Quantity: {addedProducts[product.name]}</span>
              </div>
            )}
          </li>
        ))}
      </ul>
      <h2>Mini Cart</h2>
      <ul>
        {cart.map(item => (
          <li key={item.name}>
            {item.name} - Quantity: {item.quantity}
            <button onClick={() => removeFromCart(item.name)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
