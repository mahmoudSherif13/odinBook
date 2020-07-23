import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const dbName = process.env.DB_NAME;
const dbPass = process.env.DB_PASSWORD;
const dbStr = `mongodb+srv://root:${dbPass}@cluster0.npoou.mongodb.net/${dbName}?retryWrites=true&w=majority`;
mongoose.connect(dbStr, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on("error",
  console.error.bind(console, "MongoDB connection error:")
);
