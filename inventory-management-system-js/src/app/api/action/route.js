import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';

const uri = "mongodb+srv://WeFive:Weneedspace@cluster0.3sa3h.mongodb.net/";
const client = new MongoClient(uri);

export async function POST(request) {
 // console.log(request)
  try {
    const { action, productName, initialQuantity } = await request.json();

    // Validate input data
    if (!productName || !action || isNaN(initialQuantity)) {
      return NextResponse.json(
        { success: false, message: "Invalid input data" },
        { status: 400 }
      );
    }

    // Connect to the database
    await client.connect();  // Ensure the connection is established
    const database = client.db('stock');
    const inventory = database.collection('inventory');

    // Calculate the new quantity
    const quantityChange = action === "plus" ? 1 : -1;
    const newQuantity = initialQuantity + quantityChange;

    const filter = { productName };
    const updateDoc = {
      $set: { quantity: newQuantity },
    };

    // Update the product's quantity in the database
    const result = await inventory.updateOne(filter, updateDoc);

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Quantity updated successfully. Updated ${result.modifiedCount} document(s).`,
    });
  } catch (error) {
    console.error("Error updating inventory:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  } finally {
    await client.close();  // Ensure the client connection is closed
  }
}
