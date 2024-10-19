"use client";

import { useState } from 'react';
import axios from 'axios';


const SearchProduct = () => {

  const[query,setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingaction, setLoadingaction] = useState(false);
  const [dropdown, setdropdown] = useState([]);

     const onDropdown = async (e) =>{
      let value = e.target.value;
      setQuery(value);
      if(value.length > 3){
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
      try {
        // Find the index of the product (assuming products is an array in the state)
        let index = products.findIndex((item) => item.productName === productName);
        let newProducts = JSON.parse(JSON.stringify(products));
        if(action == "plus"){

          newProducts[index].quantity = parseInt(initialQuantity) + 1;

        }else{

          newProducts[index].quantity = parseInt(initialQuantity) - 1;
        }
       
        setProducts(newProducts)
       


        let indexdrop = dropdown.findIndex((item) => item.productName === productName);
        let newDropdown = JSON.parse(JSON.stringify(dropdown));
        if(action == "plus"){

          newDropdown[indexdrop].quantity = parseInt(initialQuantity) + 1;

        }else{

          newDropdown[indexdrop].quantity = parseInt(initialQuantity) - 1;
        }
       
        setdropdown(newDropdown)
    
        // Set loading state to true before making the request
        setLoadingaction(true);
    
        // Make the API call
        const response = await axios.post('/api/action', {
          action,
          productName,
          initialQuantity,
        }, {
          headers: { 'Content-Type': 'application/json' },
        });
    
        console.log("Response:", response.data); // Handle the response as needed
      } catch (error) {
        console.error("Error during API call:", error);
      } finally {
        // Set loading state back to false after the request completes
        setLoadingaction(false);
      }
    };
    

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-6">
      <h1 className="text-5xl sm:text-4xl font-bold mb-6 text-center">Search Product</h1>

      <form
        className="bg-black w-[90vh] backdrop-blur-md py-2 rounded-lg"
        
      >
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6">
          <input
            type="text"
            placeholder="Search for a product..."
           className="border rounded-lg w-[95%] p-2"
            onBlur={()=> {setdropdown([])}}
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
    <stop offset="0" stop-color="#000000"></stop>
    <stop offset=".3" stop-color="#000000" stop-opacity=".9"></stop>
    <stop offset=".6" stop-color="#000000" stop-opacity=".6"></stop>
    <stop offset=".8" stop-color="#000000" stop-opacity=".3"></stop>
    <stop offset="1" stop-color="#000000" stop-opacity="0"></stop>
  </radialGradient>

  <circle 
    transform-origin="center" 
    fill="none" 
    stroke="url(#a12)" 
    stroke-width="20" 
    stroke-linecap="round" 
    stroke-dasharray="200 1000" 
    stroke-dashoffset="0" 
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
    transform-origin="center" 
    fill="none" 
    opacity=".2" 
    stroke="#000000" 
    stroke-width="11" 
    stroke-linecap="round" 
    cx="100" 
    cy="100" 
    r="70"
  />
</svg>

        
         </div>
}
     <div className='dropcontainer absolute w-[46.5vw] my-2 rounded-md'>

     {dropdown.map(item=>{
        return <div key={item._id} className='continar flex justify-between bg-black text-white font-semibold p-1 my-1 rounded-md border border-black border-1'>  
           <span className='productName'>{item.productName} ({item.quantity} available for ৳{item.price} )</span>
          <div className='mx-5'>
             
          <button onClick={()=>{buttonAction("sub", item.productName, item.quantity)}} disabled={loadingaction} className='subtract inline-block px-3 py-1 bg-white text-black rounded-lg font-semubold shadow-md cursor-pointer disabled:bg-blue-100'> - </button>
           <span className='quantity inline-block w-9 mx-3 text-center'>{item.quantity}</span>
            <button onClick={()=>{buttonAction("plus", item.productName, item.quantity)}}  disabled={loadingaction} className='add inline-block px-3 py-1 bg-white text-black rounded-lg font-semubold shadow-md cursor-pointer disabled:bg-blue-100'>+</button>
            </div>
           
          </div>
       })}

     </div>

    </div>
  );
};

export default SearchProduct;
