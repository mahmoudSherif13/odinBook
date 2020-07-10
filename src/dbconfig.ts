import mongoose from "mongoose";

const dbName = "typeTemp";
const dbPass = "root";
const dbStr = `mongodb+srv://root:${dbPass}@cluster0.npoou.mongodb.net/${dbName}?retryWrites=true&w=majority`;
mongoose.connect(dbStr, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on(
  "error",
  console.error.bind(console, "MongoDB connection error:")
);
