import {MongoClient} from 'mongodb';
import { NextResponse } from 'next/server';

export async function POST(request){
    
    let {action, productName, intialQuantity} = await request.json();
    
    const uri = "mongodb+srv://WeFive:Weneedspace@cluster0.3sa3h.mongodb.net/";
    const client = new MongoClient(uri);
    try {
        const database =client.db('stock');
        const inventory = database.collection('inventory');
        const filter = { productName: productName };
   
        let newQuantity = action=="plus"? (parseInt(intialQuantity + 1 )): (parseInt(intialQuantity + 1 ));
        const updateDoc = {
          $set: {
            quantity: newQuantity
          },
        };
        // Update the first document that matches the filter
        const result = await inventory.updateOne(filter, updateDoc, {} );
        
        // Print the number of matching and modified documents
        
        return NextResponse.json({ success: true, message: `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`})
      } finally {
        // Close the connection after the operation completes
        await client.close();
      }
}
