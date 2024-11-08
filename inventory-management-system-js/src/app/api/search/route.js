import {MongoClient} from 'mongodb';
import { NextResponse } from 'next/server';

export async function GET(request){
    
 const query = request.nextUrl.searchParams.get("query");

    const uri = "mongodb+srv://WeFive:Weneedspace@cluster0.3sa3h.mongodb.net/";
    const client = new MongoClient(uri);
    try{
        const database =client.db('stock');
        const inventory = database.collection('inventory');

     
        const products = await inventory.aggregate([
          {
            $match: {
              $or: [
                { productName: { $regex: query, $options: "i" } }, // Match in name
                { category: { $regex: query, $options: "i" } }, // Match in category
              ].filter(condition => Object.keys(condition).length) // Remove empty objects
            }
          }
        ]).toArray(); // Convert the cursor to an array
        return NextResponse.json({success:true, products})
    }finally{
        await client.close();
    }
}



