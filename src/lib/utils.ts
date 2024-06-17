import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import mongoose from "mongoose"
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const connectToDatabase = async () => {
  try {
    // Check if already connected
    if (mongoose.connection.readyState) {
      console.log('Already connected to the database.');
      return;
    }

    // Connect to the database
    const { connection } = await mongoose.connect(process.env.MONGODB_URI as string);

    console.log(`Database connected successfully: ${connection.host}`);
  } catch (err) {
    console.error('Error connecting to database:', err);
    throw new Error('Error connecting to database');
  }
};