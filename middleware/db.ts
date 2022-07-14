import { Db, MongoClient } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";

declare global {
  var mongo: {
    client?: MongoClient;
  };
}

declare module "next" {
  interface NextApiRequest {
    dbClient: MongoClient;
    db: Db;
  }
}

global.mongo = global.mongo || {};

export async function getMongoClient() {
  if (!global.mongo.client) {
    if (!process.env.MONGODB_URI) {
      throw new Error("No MongoDB Connection String");
    }
    global.mongo.client = new MongoClient(process.env.MONGODB_URI);
  }

  await global.mongo.client.connect();

  return global.mongo.client;
}

export default async function db(
  req: NextApiRequest,
  res: NextApiResponse,
  next: any
) {
  if (!global.mongo.client) {
    if (!process.env.MONGODB_URI) {
      throw new Error("No MongoDB Connection String");
    }
    global.mongo.client = new MongoClient(process.env.MONGODB_URI);
  }
  req.dbClient = await getMongoClient();
  req.db = req.dbClient.db("HouseComms"); // this use the database specified in the MONGODB_URI (after the "/")

  return next();
}
