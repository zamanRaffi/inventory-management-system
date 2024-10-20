import mongoose from "mongoose";

let isConnected = false; 

export const connectdb = async () => {
  if (isConnected) {
    console.log("Database already connected");
    return;
  }

  try {
    const { connection } = await mongoose.connect(
      "mongodb+srv://WeFive:Weneedspace@cluster0.3sa3h.mongodb.net/stock",
      { 
        useNewUrlParser: true, 
        useUnifiedTopology: true 
      }
    );

    connection.on('connected', () => {
      console.log("Database connected");
    });

    connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
      process.exit(1);
    });

    isConnected = connection.readyState === 1;
    console.log(`MongoDB connected: ${connection.readyState === 1}`);


  } catch (error) {
    console.error("Error connecting to database:", error.message);
    process.exit(1); 
  }
};
