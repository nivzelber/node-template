import { MongoClient } from "mongodb";

import { logger } from "./logger";

const url = "mongodb+srv://latwoManager:latwoManager112233@restmanagerdb.chveis9.mongodb.net/test";

const client = new MongoClient(url);
try {
  client.connect();
  logger.info("Mongo Connected ");
} catch {
  logger.error("Mongo Not Connected");
}
//     //await createListing(client, { name: "Ariel", lastName: "Miz", date: "24/02/1999" });
//     //await findListingByName(client, "Ariel");
//     //await findMultListing(client, { date: "24/02/1999" });
//     //await deleteOneListing(client, "Ori");

export async function createListing(newListing) {
  const result = await client.db("RestManagerDB").collection("users").insertOne(newListing);

  console.log(`new listing created with following id : ${result.insertedId}`);
}

export async function findMultListing(prop) {
  // find multiplay objects by date - return whole object
  const cursor = await client.db("RestManagerDB").collection("users").find({ date: prop });

  const result = await cursor.toArray();
  console.log(`Found listing with the date mention : ${prop}`);
  result.forEach(result => {
    console.log(result);
  });
}

export async function findListingByName(nameOfListing) {
  // find one object by name - return whole object
  const result = await client.db("RestManagerDB").collection("users").findOne({
    name: nameOfListing
  });
  if (result) {
    console.log(`Found a listing in the collection with the name : ${nameOfListing}`);
    console.log(result);
  } else {
    console.log(`Not found listing with the name : ${nameOfListing}`);
  }
}

export async function updateListingByName(nameOfListing, value) {
  const result = await client
    .db("RestManagerDB")
    .collection("users")
    .updateOne({ name: nameOfListing }, { $set: value });
  console.log(`${result.matchedCount} document(s) matched the query criteria`);
  console.log(`${result.modifiedCount} documents was/were updated`);
}

export async function deleteOneListing(nameOfListing) {
  const result = await client
    .db("RestManagerDB")
    .collection("users")
    .deleteOne({ name: nameOfListing });

  console.log(`${result.deletedCount} document(s) was/were deleted`);
}

export async function listDatabases() {
  //return list of db tables
  const databaseList = await client.db().admin().listDatabases();
  logger.info("databases :");
  databaseList.databases.forEach(db => {
    logger.info(`- ${db.name}`);
  });
}
