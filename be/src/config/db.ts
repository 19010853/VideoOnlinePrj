import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const DBConnect = async () => {
    try {
        const db = await mongoose.connect(process.env.MONGO_URI as string);
        console.log("Database connected successfully:", db.connection.name);
    } catch (error) {
        console.error("Database connection error:", error);
    }
}

export default DBConnect;
