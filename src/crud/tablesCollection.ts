//DB op for Tables table

import { client } from "../mongo";
import { logger } from "../logger";

export async function createTable(newTable) {
  const result = await client.db("RestManagerDB").collection("tables").insertOne(newTable);
  logger.info(`new listing created with following id : ${result.insertedId}`);
  return result;
}

export async function findTableById(table_id) {
  const result = await client.db("RestManagerDB").collection("tables").findOne({ table_id });
  if (result) {
    logger.info(`Found an order in the collection with the number : ${table_id}`);
  } else {
    logger.info(`Not found an order with the name : ${table_id}`);
  }
  return result;
}

export async function findTableByName(owner) {
  // find one Table by NAME of the Owner - return whole object
  const result = await client.db("RestManagerDB").collection("tables").findOne({ owner });
  if (result) {
    logger.info(`Found a Table in the collection with the name : ${owner}`);
    logger.info(result);
  } else {
    logger.info(`Not found a Table with the name : ${owner}`);
  }
  return result;
}
export async function findMultTables(shape) {
  // find multiplay objects by SHAPE - return whole objects
  const cursor = await client.db("RestManagerDB").collection("tables").find({ shape });
  const result = await cursor.toArray();
  if (result.length > 0) {
    logger.info(`Found listing with the shape mention : ${shape}`);
    result.forEach(result => {
      logger.info(result);
    });
  } else {
    logger.info(`NOT! Found listing with the shape mention : ${shape}`);
  }
  return result;
}

export async function updateTableByName(owner, value) {
  const result = await client
    .db("RestManagerDB")
    .collection("tables")
    .updateOne({ owner }, { $set: { owner: value } });
  logger.info(`${result.matchedCount} document(s) matched the query criteria`);
  logger.info(`${result.modifiedCount} documents was/were updated`);
  return result;
}
// Updating shape by the id of the table
export async function updateTableById(table_id, value) {
  const result = await client
    .db("RestManagerDB")
    .collection("tables")
    .updateOne({ table_id }, { $set: { table_id: value } });
  logger.info(`${result.matchedCount} document(s) matched the query criteria`);
  logger.info(`${result.modifiedCount} documents was/were updated`);
  return result;
}

export async function deleteOneTableByName(owner) {
  const result = await client.db("RestManagerDB").collection("tables").deleteOne({ owner });
  logger.info(`${result.deletedCount} document(s) was/were deleted`);
  return result;
}
export async function deleteOneTableById(table_id) {
  const result = await client.db("RestManagerDB").collection("tables").deleteOne({ table_id });
  logger.info(`${result.deletedCount} document(s) was/were deleted`);
  return result;
}