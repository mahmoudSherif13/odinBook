import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

const mongooseOpts = {
  // options for mongoose 4.11.3 and above
  autoReconnect: true,
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 1000,
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
export async function connect() {
  const mongoServer = new MongoMemoryServer();
  mongoose.Promise = Promise;
  const mongoUri = await mongoServer.getConnectionString();
  mongoose.connect(mongoUri, mongooseOpts);
}
