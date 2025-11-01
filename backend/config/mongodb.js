import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongoURL = process.env.MONGO_URL;
    const conn = await mongoose.connect(mongoURL);
    console.log("MongoDB Connected");
  } catch (error) {
    console.log("MongoDB connection Error: ", error);
    process.exit(1);
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected");
});

process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("MongoDB connection closed due to app termination.");
  process.exit(0);
});
export default connectDB;
