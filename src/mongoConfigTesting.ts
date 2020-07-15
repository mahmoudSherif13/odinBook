import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";


const mongoServer = new MongoMemoryServer();
export async function start(){
  mongoose.Promise = Promise;
  const mongoUri = await mongoServer.getConnectionString();

  const mongooseOpts = {
    // options for mongoose 4.11.3 and above
    autoReconnect: true,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 1000,
    useNewUrlParser: true
  };

  await mongoose.connect(mongoUri, mongooseOpts);
}

export async function close(){
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
}

