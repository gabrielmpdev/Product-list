import React, { useState } from 'react';  
import { Product } from '../types';  
import products from '../data.json';  
import styles from '../styles/scss/styles.scss';  

const ProductList: React.FC = () => {  
  const [cart, setCart] = useState<{ name: string; quantity: number; price: number }[]>([]);  
  const [addedProducts, setAddedProducts] = useState<{ [key: string]: number }>({});  
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortOrder, setSortOrder] = useState('asc');

  const getImageUrl = (product: Product) => {  
    const width = window.innerWidth;  
    if (width >= 1024) {  
      return product.image.desktop;  
    } else if (width >= 768) {  
      return product.image.tablet;  
    } else {  
      return product.image.mobile;  
    }  
  };  

  const findProduct = (name: string) => products.find(product => product.name === name);

  const addToCart = (productName: string, productPrice: number) => {  
    setAddedProducts(prev => ({ ...prev, [productName]: (prev[productName] || 0) + 1 }));  
    setCart(prevCart => {  
      const existingProduct = prevCart.find(item => item.name === productName);  
      if (existingProduct) {  
        return prevCart.map(item =>  
          item.name === productName  
            ? { ...item, quantity: item.quantity + 1 }  
            : item  
        );  
      }  
      return [...prevCart, { name: productName, quantity: 1, price: productPrice }];  
    });  
  };  

  const removeFromCart = (productName: string) => {  
    setCart(prevCart => prevCart.filter(item => item.name !== productName));  
    setAddedProducts(prev => {  
      const { [productName]: _, ...rest } = prev;  
      return rest;  
    });  
  };  

  const increaseQuantity = (productName: string) => {  
    setCart(prevCart =>  
      prevCart.map(item =>  
        item.name === productName  
          ? { ...item, quantity: item.quantity + 1 }  
          : item  
      )  
    );  
    setAddedProducts(prev => ({ ...prev, [productName]: (prev[productName] || 0) + 1 }));  
  };  

  const decreaseQuantity = (productName: string) => {  
    setCart(prevCart => {  
      const product = prevCart.find(item => item.name === productName);  
      if (product && product.quantity > 1) {  
        return prevCart.map(item =>  
          item.name === productName  
            ? { ...item, quantity: item.quantity - 1 }  
            : item  
        );  
      } else {  
        return prevCart.filter(item => item.name !== productName);  
      }  
    });  
    setAddedProducts(prev => {  
      const newCount = (prev[productName] || 0) - 1;  
      if (newCount <= 0) {  
        const { [productName]: _, ...rest } = prev;  
        return rest;  
      }  
      return { ...prev, [productName]: newCount };  
    });  
  };  

  const calculateTotal = () => {  
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);  
  };  

  const emptyCartImage = './assets/images/illustration-empty-cart.svg'; 

  const confirmOrder = () => {
    setIsPopupOpen(true);
  };

  const startNewOrder = () => {
    setCart([]);
    setAddedProducts({});
    setIsPopupOpen(false);
  };

  // Filtros e Ordenação
  const categories = ['All'];
  const uniqueCategories = new Set(products.map(product => product.category));

  uniqueCategories.forEach(category => {
    categories.push(category);
  });

  const filteredProducts = products.filter(product =>
    selectedCategory === 'All' || product.category === selectedCategory
  );

  const sortedProducts = filteredProducts.sort((a, b) =>
    sortOrder === 'asc' ? a.price - b.price : b.price - a.price
  );

  return (  
    <div className="mainContainer">  
    <div className="filters">
  <h3 className='filterTitle'>Filters:</h3>
  <div className='filters-content'>
   
    <select onChange={(e) => setSelectedCategory(e.target.value)} defaultValue="Category">
      <option value="Category" disabled>
        Category
      </option>
      {categories.map((category) => (
        <option key={category} value={category}>
          {category}
        </option>
      ))}
    </select>
    
    <select onChange={(e) => setSortOrder(e.target.value)} defaultValue="asc">
      <option value="asc">Price: Low to High</option>
      <option value="desc">Price: High to Low</option>
    </select>
  </div>
</div>

      <h1 className="titleList">Desserts</h1>  
      
      

      <div className="container">  
        <ul className="listProducts">  
          {sortedProducts.map((product: Product) => (  
            <li className="box-product" key={product.name}>  
              <div className="image-button-container">  
                <img src={getImageUrl(product)} alt={product.name} className="product-image" />  
                {!addedProducts[product.name] ? (  
                  <button className="add-to-cart" onClick={() => addToCart(product.name, product.price)}>  
                    <img src="./assets/images/icon-add-to-cart.svg" alt="Add to Cart" /> Add to Cart  
                  </button>  
                ) : (  
                  <div className="quantity">  
                    <button onClick={() => increaseQuantity(product.name)}>  
                      <img src="../assets/images/icon-increment-quantity.svg" alt="Increase" />  
                    </button>  
                    <span>{addedProducts[product.name]}</span>  
                    <button onClick={() => decreaseQuantity(product.name)}>  
                      <img src="../assets/images/icon-decrement-quantity.svg" alt="Decrease" />  
                    </button>  
                  </div>  
                )}  
              </div>  
              <div className="product-info">  
                <p className="categoryName">{product.category}</p>  
                <h2>{product.name}</h2>  
                <p className="price">${product.price.toFixed(2)}</p>  
              </div>  
            </li>  
          ))}  
        </ul>  

        <div className="minicartProducts">  
          <h2>Your Cart ({cart.reduce((total, item) => total + item.quantity, 0)})</h2>  
          {cart.length === 0 ? (  
            <div style={{ textAlign: 'center' }}>  
              <img src={emptyCartImage} alt="Carrinho vazio" style={{ width: '100px', height: 'auto' }} />  
              <p>Your added items will appear here</p>  
            </div>  
          ) : (  
            <>  
            <ul>  
              {cart.map(item => (   
                <li key={item.name} className="productsCart">  
                  <h3 className='itemTitleCart'>{item.name} </h3>
                  <span>   
                   <p className='quantityCartItem'> {item.quantity}x </p>  
                   <p className='priceCartItem'>  @${item.price.toFixed(2)}</p>  
                   <p className='totalPriceCartItem'> ${(item.price * item.quantity).toFixed(2)} </p> 
                  </span>   
                  <button className="removeProduct" onClick={() => removeFromCart(item.name)}>
                    <img src="./assets/images/icon-remove-item.svg"/>
                  </button>  
                </li>  
              ))}  
            </ul>  
            <p className="total">Order Total <span>${calculateTotal().toFixed(2)}</span></p>  
            <p className="carbon-neutral">
              <img src="./assets/images/icon-carbon-neutral.svg"/>This is a <span>carbon-neutral</span> delivery
            </p>  
            <button className="confirm-order" onClick={confirmOrder}>Confirm Order</button>  
            </>  
          )}  
        </div>  
      </div>  

      {isPopupOpen && (  
        <div className="popup">  
          <div className="popup-content">  
            <div className="popup-header">  
              <span className="check-icon"><img src='./assets/images/icon-order-confirmed.svg' alt="Order Confirmed"/></span>  
              <h2>Order Confirmed</h2>  
              <p className="popup-subtitle">We hope you enjoy your food!</p>  
            </div>  
            <div className='order-summary-list'>  
              <ul className="order-summary">  
                {cart.map(item => {  
                  const product = findProduct(item.name);  
                  return (  
                    <li key={item.name} className="order-item">  
                      <img src={product?.image.thumbnail} alt={item.name} style={{ width: '50px', marginRight: '10px' }} />  
                      <span>   
                        {item.name}  
                        <p className='quantityCartItemPopUp'> <span className='quantityCartItem'>{item.quantity}x </span> <span className='priceCartItem'>@   ${item.price.toFixed(2)}</span></p>  
                      </span>   
                      <span className="item-total"> ${(item.price * item.quantity).toFixed(2)} </span>  
                    </li>   
                  );  
                })}  
              </ul>  
              <p className="total">Order Total: <span> ${calculateTotal().toFixed(2)}</span></p>  
            </div>  
            <button className="start-order-button" onClick={startNewOrder}>Start New Order</button>  
          </div>  
        </div>  
      )}
    </div>  
  );  
};  

export default ProductList;
