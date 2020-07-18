import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

const mongoServer = new MongoMemoryServer();

const mongooseOpts = {
  // options for mongoose 4.11.3 and above
  autoReconnect: true,
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 1000,
  useNewUrlParser: true,
};

mongoose.Promise = Promise;
mongoServer.getConnectionString().then((mongoUri) => {
  mongoose.connect(mongoUri, mongooseOpts);
});
