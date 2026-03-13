import dotenv from "dotenv";
dotenv.config();
export const PORT = Number(process.env.PORT) || 9000;
export const MONGODB_URI = process.env.MONGODB_URI;
