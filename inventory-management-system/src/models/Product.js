import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  category: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

mongoose.models = {};
// Map this schema to the 'inventory' collection in the 'stock' database
const ProductModel = mongoose.models.Product || mongoose.model('Product', productSchema, 'inventory');

class Product {
  constructor(productName, price, quantity, category) {
    this.productName = productName;
    this.price = price;
    this.quantity = quantity;
    this.category = category;
  }

  async save() {
    const product = new ProductModel(this);
    return await product.save();
  }

  // Get all products from the 'inventory' collection
  static async getAll() {
    return await ProductModel.find();
  }

  // Delete product by query ( by _id)
 static async deleteById(query) {
    return await ProductModel.deleteOne(query);
  }
}

export default Product;
