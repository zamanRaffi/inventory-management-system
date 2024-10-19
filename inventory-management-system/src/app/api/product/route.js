import {MongoClient,ObjectId} from 'mongodb';
import { NextResponse } from 'next/server';

export async function GET(request){
    
    const uri = "mongodb+srv://WeFive:Weneedspace@cluster0.3sa3h.mongodb.net/";
    const client = new MongoClient(uri);
    try{
        const database =client.db('stock');
        const inventory = database.collection('inventory');
        const query= { };
        const products =await inventory.find(query).toArray();
        return NextResponse.json({success:true, products})
    }finally{
        await client.close();
    }
}


export async function POST(request){
    
    let body = await request.json();
    console.log('Request body:', body);
    const uri = "mongodb+srv://WeFive:Weneedspace@cluster0.3sa3h.mongodb.net/";
    const client = new MongoClient(uri);
    try{
        const database =client.db('stock');
        const inventory = database.collection('inventory');
        const product =await inventory.insertOne(body)
        return NextResponse.json({product, ok:true})
    }finally{
        await client.close();
    }

}

export async function DELETE(request) {
    const uri = 'mongodb+srv://WeFive:Weneedspace@cluster0.3sa3h.mongodb.net/';
    const client = new MongoClient(uri);
//  console.log(request)
    try {
      const database = client.db('stock');
      const inventory = database.collection('inventory');
  
      // Extract the ID from the request body
      const { id } = await request.json();
  
      if (!id) {
        return NextResponse.json({ message: 'ID is required', ok: false });
      }
  
      const query = { _id: new ObjectId(id) };  // Convert the string ID to ObjectId
      const result = await inventory.deleteOne(query);
  
      if (result.deletedCount === 1) {
        console.log('Successfully deleted one document.');
        return NextResponse.json({ message: 'Product deleted successfully', ok: true });
      } else {
        console.log('No matching document found. Deleted 0 documents.');
        return NextResponse.json({ message: 'No matching product found', ok: false });
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      return NextResponse.json({ message: 'Error deleting product', ok: false });
    } finally {
      await client.close();
    }
  }