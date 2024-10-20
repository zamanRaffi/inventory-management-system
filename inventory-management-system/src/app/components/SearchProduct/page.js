"use client";

import { useState } from 'react';
import axios from 'axios';
import { useProducts } from '../../../ProductContext';

const SearchProduct = () => {

  const { products, setProducts } = useProducts();
  const[query,setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(null);
  const [dropdown, setdropdown] = useState([]);

     const onDropdown = async (e) =>{
      let value = e.target.value;
      setQuery(value);
      if(value.length > 0){
         setLoading(true);
         setdropdown([]);
      const response = await axios.get('/api/search?query=' + query); 
      setdropdown(response.data.products); // Directly access data from the response
      setLoading(false);
    }else{
      setdropdown([])
    }
     }


     const buttonAction = async (action, productName, initialQuantity) => {
      setLoadingProduct(productName);
      try {
        // Find the product index in both 'products' and 'dropdown'
        const productIndex = products.findIndex((item) => item.productName === productName);
        const dropdownIndex = dropdown.findIndex((item) => item.productName === productName);
    
        if (productIndex === -1 || dropdownIndex === -1) {
          console.error(`Product "${productName}" not found.`);
          return; // Prevent further execution if product not found
        }
    
        // Clone the arrays to avoid direct state mutation
        const updatedProducts = [...products];
        const updatedDropdown = [...dropdown];
    
        // Update the product quantities
        const quantityChange = action === "plus" ? 1 : -1;
        updatedProducts[productIndex].quantity = parseInt(initialQuantity) + quantityChange;
        updatedDropdown[dropdownIndex].quantity = parseInt(initialQuantity) + quantityChange;
    
        // Update the states
        setProducts(updatedProducts);
        setdropdown(updatedDropdown);
    
        // Set loading state to true before the API call
        setLoadingProduct(true);
    
        // Make the API call
        const response = await axios.post(
          "/api/action",
          { action, productName, initialQuantity },
          { headers: { "Content-Type": "application/json" } }
        );
    
        console.log("Response:", response.data); // Handle the API response as needed
      } catch (error) {
        console.error("Error during API call:", error);
      } finally {
        // Reset loading state after the request completes
        setLoadingProduct(null)
      }
    };
    
    

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-6">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 text-center">Search Product</h1>

      <form
        className="bg-black w-[90vh] backdrop-blur-md py-2 rounded-lg"
        
      >
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6">
          <input
            type="text"
            placeholder="Search for a product..."
           className="border rounded-lg w-[95%] p-2"
            onChange={onDropdown}
          />

          {/* <select
           className="bg-blue-200 font-bold shadow border border-black appearance-none rounded-md py-2 px-3 focus:outline-none focus:shadow-outline"
          >
            <option value="name">Product Name</option>
            <option value="category">Category</option>
            <option value="price">Price</option>
          </select> */}

        </div>
      </form>
       {loading && <div className='flex justify-center items-center '>
        
        <svg 
  xmlns="http://www.w3.org/2000/svg" 
  viewBox="0 0 200 200" 
  width="65" 
  height="65"
>
  <radialGradient id="a12" cx=".66" fx=".66" cy=".3125" fy=".3125" gradientTransform="scale(1.5)">
    <stop offset="0" stopColor="#000000"></stop>
    <stop offset=".3" stopColor="#000000" stopOpacity=".9"></stop>
    <stop offset=".6" stopColor="#000000" stopOpacity=".6"></stop>
    <stop offset=".8" stopColor="#000000" stopOpacity=".3"></stop>
    <stop offset="1" stopColor="#000000" stopOpacity="0"></stop>
  </radialGradient>

  <circle 
    transformOrigin="center" 
    fill="none" 
    stroke="url(#a12)" 
    strokeWidth="20" 
    strokeLinecap="round" 
    strokeDasharray="200 1000" 
    strokeDashoffset="0" 
    cx="100" 
    cy="100" 
    r="70"
  >
    <animateTransform 
      type="rotate" 
      attributeName="transform" 
      calcMode="spline" 
      dur="2s" 
      values="360;0" 
      keyTimes="0;1" 
      keySplines="0 0 1 1" 
      repeatCount="indefinite"
    />
  </circle>

  <circle 
    transformOrigin="center" 
    fill="none" 
    opacity=".2" 
    stroke="#000000" 
    strokeWidth="11" 
    strokeLinecap="round" 
    cx="100" 
    cy="100" 
    r="70"
  />
</svg>

        
         </div>
}
     <div className='dropcontainer absolute w-[46.5vw] my-2 rounded-md'>

     {dropdown.map((item) => (
  <div
    key={item._id}
    className="continar flex justify-between bg-black text-white font-semibold p-1 my-1 rounded-md border border-black"
  >
    <span className="productName">
      {item.productName} ({item.quantity} available for ৳{item.price})
    </span>
    <div className="mx-5 flex items-center">
      <button
        onClick={() => buttonAction("minus", item.productName, item.quantity)}
        disabled={loadingProduct === item.productName || item.quantity <= 0}
        className="subtract inline-block px-3 py-1 bg-white text-black rounded-lg font-semibold shadow-md cursor-pointer disabled:bg-blue-100"
      >
        -
      </button>
      <span className="quantity inline-block w-9 mx-3 text-center">
        {item.quantity}
      </span>
      <button
        onClick={() => buttonAction("plus", item.productName, item.quantity)}
        disabled={loadingProduct}
        className="add inline-block px-3 py-1 bg-white text-black rounded-lg font-semibold shadow-md cursor-pointer disabled:bg-blue-100"
      >
        +
      </button>
    </div>
  </div>
))}


     </div>

    </div>
  );
};

export default SearchProduct;
