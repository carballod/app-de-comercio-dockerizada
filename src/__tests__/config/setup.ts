import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

let mongod: MongoMemoryServer;

beforeAll(async () => {
  try {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.connect(uri);
  } catch (error) {
    console.error("Error connecting to the in-memory database", error);
    throw error;
  }
});

afterAll(async () => {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    if (mongod) {
      await mongod.stop();
    }
  } catch (error) {
    console.error("Error cleaning up the test database", error);
    throw error;
  }
});

beforeEach(async () => {
  try {
    if (!mongoose.connection || !mongoose.connection.db) {
      throw new Error("Database not initialized");
    }

    const collections = await mongoose.connection.db.collections();

    for (const collection of collections) {
      await collection.deleteMany({});
    }
  } catch (error) {
    console.error("Error cleaning up collections", error);
    throw error;
  }
});

export const getMongoConnection = () => {
  if (!mongoose.connection || !mongoose.connection.db) {
    throw new Error("Database connection not established");
  }
  return mongoose.connection;
};
