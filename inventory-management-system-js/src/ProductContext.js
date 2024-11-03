// context/ProductContext.js
'use client'; 

import { createContext, useContext, useState } from 'react';

// Create the context
const ProductContext = createContext();

// Create a custom hook for consuming the context
export const useProducts = () => useContext(ProductContext);

// Create the context provider
export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);

  return (
    <ProductContext.Provider value={{ products, setProducts }}>
      {children}
    </ProductContext.Provider>
  );
};
