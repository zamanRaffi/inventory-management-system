'use client';

import axios from 'axios';
import { useState, useEffect } from 'react';

const ProductModel = ({ isOpen, onClose, onSubmit, productData }) => {
  const [formData, setFormData] = useState({
    id: null,
    productName: '',
    category: '',
    quantity: '',
    price: '',
  });
 
  useEffect(() => {
    if (productData) {
      setFormData({
        id: productData._id,
        productName: productData.product_name,
        category: productData.category,
        quantity: productData.quantity,
        price: productData.price,
      });
    } else {
      setFormData({ id: null, productName: '', category: '', quantity: '', price: '' });
    }
  }, [productData]);

  
 

  return (
    <>
     
    </>
  );
};

export default ProductModel;
