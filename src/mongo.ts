import { MongoClient } from "mongodb";

import { logger } from "./logger";

const url = "mongodb+srv://latwoManager:latwoManager112233@restmanagerdb.chveis9.mongodb.net/test";

export const client = new MongoClient(url);
try {
  client.connect();
  logger.info("Mongo Connected ");
} catch {
  logger.error("Mongo Not Connected");
}

export async function listDatabases() {
  //return list of db tables
  const databaseList = await client.db().admin().listDatabases();
  logger.info("databases :");
  databaseList.databases.forEach(db => {
    logger.info(`- ${db.name}`);
  });
}
