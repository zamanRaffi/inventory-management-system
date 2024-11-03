import { connectdb } from '../../../lib/dbConnect'
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';
import Product from '../../../models/Product'


export async function GET() {
  await connectdb();
  const products = await Product.getAll();
  // console.log(products);
  return new NextResponse(JSON.stringify({ products }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}


export async function POST(request) {
  await connectdb();
  const { productName, price, quantity, category } = await request.json();
  const product = new Product(productName, price, quantity, category);
  const savedProduct = await product.save();
  return new NextResponse(JSON.stringify(savedProduct), {
    status: 201,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}


export async function DELETE(request) {
  try {
    await connectdb(); // Ensure database connection

    const { id } = await request.json();
  
      if (!id) {
        return NextResponse.json({ message: 'ID is required', ok: false });
      }
  

    const query = { _id: new ObjectId(id) }; // Convert string ID to ObjectId
    const result = await Product.deleteById(query); // Use query object for deletion

    if (result.deletedCount === 1) {
      //console.log('Successfully deleted one document.');
      return NextResponse.json({ message: 'Product deleted successfully', ok: true });
    } else {
      //console.log('No matching document found.');
      return NextResponse.json({ message: 'No matching product found', ok: false });
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ message: 'Error deleting product', ok: false });
  }
}
