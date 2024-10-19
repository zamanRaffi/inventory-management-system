'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

const Product = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    productName: '',
    category: '',
    quantity: '',
    price: '',
  });
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState("");


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/product'); // Correct endpoint
        setProducts(response.data.products); // Directly access data from the response
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
  
    fetchProducts();
  }, []);
  

  const handleOpenModal = () => {
    setFormData({ productName: '', category: '', quantity: '', price: '' }); // Reset form data
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addProduct = async (e) => {
    
    
    try {
        // Optional: Validate formData here before sending
        const response = await axios.post('/api/product', {
            ...formData,
        });

        if (response.status === 201) {
            console.log('Product added successfully');
            setProducts([...products, { ...formData }]); // Update product list
            setIsModalOpen(false); // Close the modal
            setFormData({}); // Reset form data
            setAlert("Your Product has been added!");
        } else {
            console.error('Error adding product:', response.data);
            setAlert("Failed to add product. Please try again.");
        }
    } catch (error) {
        console.error('Error:', error);
        setAlert("An error occurred while adding the product.");
    }

    //fatch all the products agaun  to  sync back
    const response = await axios.get('/api/product'); // Correct endpoint
    setProducts(response.data.products); 
    e.preventDefault();
};

const handleDeleteProduct = async (id) => {
  console.log(id)
  try {
    const response = await axios.delete(`/api/product`, {
      data: { id }, // Send 'id' in the request body
      
    });
   
    if (response.status !== 200) throw new Error('Failed to delete product');

    // Fetch all products again to sync the UI
    const getResponse = await axios.get('/api/product');
    setProducts(getResponse.data.products);  // Update the product list
  } catch (err) {
    console.error('Error deleting product:', err);
  }
};



  return (
    <div className="p-4">
  
       <div className='text-greeen-800 text-center'>{alert}</div>
      <button
        className="bg-black hover:bg-white hover:text-black text-white font-bold text-xl px-4 py-2 border border-black rounded-xl focus:outline-none mt-8 mb-4"
        onClick={handleOpenModal}
      >
        Add Product
      </button>

      <h2 className="text-3xl font-bold mt-12">Current Inventory</h2>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : products.length === 0 ? (
        <p>No products available.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto bg-blue-300 border border-black mt-2 ">
            <thead>
              <tr className="bg-black divide-x divide-white"> 
                <th className="px-4 py-1 divide-x divide-white text-white">Product Name</th>
                <th className="px-4 py-1 divide-x divide-white text-white">Category</th>
                <th className="px-4 py-1 divide-x divide-white text-white">Quantity</th>
                <th className="px-4 py-1 divide-x divide-white text-white">Price</th>
                <th className="px-4 py-1 divide-x divide-white text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="bg-gray-50">
                  <td className="px-4 py-1 border border-black">{product.productName}</td>
                  <td className="px-4 py-1 border border-black">{product.category}</td>
                  <td className="px-4 py-1 border border-black">{product.quantity}</td>
                  <td className="px-4 py-1 border border-black">{product.price} ৳</td>
                  <td className="px-4 py-1 border border-black">
                    <button
                      onClick={() => handleDeleteProduct(product._id)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}






      {/* Modal for Adding Product */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-80">
          <div className="bg-custom p-4 rounded-xl shadow-lg w-2/3">
            <form onSubmit={addProduct}>
              <div className="mb-4">
                <label className="block text-md font-bold mb-2">Product Name</label>
                <input
                  type="text"
                  name="productName"
                  value={formData?.productName}
                  onChange={handleInputChange}
                  className="border rounded-lg w-full p-2"
                  placeholder="Enter product name"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-md font-bold mb-2">Category</label>
                <input
                  type="text"
                  name="category"
                  value={formData?.category || ""}
                  onChange={handleInputChange}
                  className="border rounded-lg w-full p-2"
                  placeholder="Enter category"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-md font-bold mb-2">Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData?.quantity || ""}
                  onChange={handleInputChange}
                  className="border rounded-lg w-full p-2"
                  placeholder="Enter quantity"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-md font-bold mb-2">Price</label>
                <input
                  type="number"
                  name="price"
                  value={formData?.price || ""}
                  onChange={handleInputChange}
                  className="border rounded-lg w-full p-2"
                  placeholder="Enter price"
                  required
                />
              </div>
              <div className="flex justify-between">
                <button
                  type="submit"
                  className="bg-black hover:bg-white hover:text-black text-white font-bold py-2 px-4 rounded-xl"
                >
                  Add Product
                </button>
                <button
                  type="button"
                  className="bg-red-400 hover:bg-red-500 font-bold py-2 px-4 rounded-xl"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Product;
