import mongoose from "mongoose";
import dns from "dns";

// Configure DNS to use public DNS servers (8.8.8.8 / 1.1.1.1) and IPv4 first on Windows
// to prevent local DNS / ISP querySrv ECONNREFUSED errors for MongoDB Atlas.
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {
  // Ignore if custom DNS servers cannot be set in environment
}

if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder("ipv4first");
}

const connectDB = async () => {
  const primaryUri = process.env.MONGO_URI;
  const localUri = "mongodb://127.0.0.1:27017/hackinmotion";

  if (primaryUri) {
    try {
      const connection = await mongoose.connect(primaryUri, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log(`MongoDB Connected: ${connection.connection.host}`);
      return;
    } catch (error) {
      console.warn(`MongoDB Atlas connection timed out/failed (${error.message}).`);
      console.warn("Switching fallback to local MongoDB (127.0.0.1:27017)...");
    }
  }

  try {
    const fallbackConnection = await mongoose.connect(localUri);
    console.log(`MongoDB Connected (Local Fallback): ${fallbackConnection.connection.host}`);
  } catch (fallbackError) {
    console.error("MongoDB Connection Failed:", fallbackError.message);
    console.error("\n⚠️  MongoDB Atlas Connection Troubleshooting:");
    console.error("1. Make sure your current IP address is whitelisted in MongoDB Atlas (Network Access -> Add IP Address -> 0.0.0.0/0).");
    console.error("2. Verify that your MONGO_URI string in server/.env is valid.");
    console.error("3. Ensure local MongoDB service is running on 127.0.0.1:27017.\n");
  }
};

export default connectDB;