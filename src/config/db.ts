import mongoose from "mongoose";
import config from "./config.js";

const connectDB = async () => {
  try{
    const conn = await mongoose.connect(config.Mongo);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  }
  catch(error){
    console.log("MongoDB connection error: ", error);
  }
}
export default connectDB;