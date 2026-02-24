const mongoose = require("mongoose");

const connectMongoDB = async () => {
  const { MONGO_URI } = process.env;

  if (!MONGO_URI) {
    console.log("⚠️  MongoDB URI not configured (development mode)");
    return;
  }

  if (mongoose.connection.readyState === 1) {
    return;
  }

  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
  }
};

module.exports = {
  connectMongoDB,
};
