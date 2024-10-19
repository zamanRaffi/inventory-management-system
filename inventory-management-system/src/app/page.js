import Header from "./components/Header/page";
import Product from "./components/Product/page";
import ProductSearch from './components/SearchProduct/page';
export default function Home() {
  return (
    <>
      <Header />
      {/* Display current inventory */}


   

     <div className="container bg-custom mx-auto w-[95%] p-6 rounded-lg shadow-2xl">

        {/* Search a Product */}
      <div className="p-4">
      <ProductSearch />

      </div>
    

        {/* Product page */}

         
         <Product/>


        
        

        

        </div>
     


    </>
  );
}
