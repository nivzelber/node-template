//DB op for orders table

import { client } from "../mongo";
import { logger } from "../logger";

export async function createOrder(newOrder) {
  const result = await client.db("RestManagerDB").collection("orders").insertOne(newOrder);
  logger.info(`new listing created with following id : ${result.insertedId}`);
  return result;
}

export async function findOrderByNumber(orderNumber) {
  const result = await client.db("RestManagerDB").collection("orders").findOne({
    orderNumber
  });
  if (result) {
    logger.info(`Found an order in the collection with the number : ${orderNumber}`);
  } else {
    logger.info(`Not found an order with the name : ${orderNumber}`);
  }
  return result;
}
export async function findOrderByName(orderOwner) {
  // find one object by NAME - return whole object
  const result = await client.db("RestManagerDB").collection("orders").findOne({ orderOwner });
  if (result) {
    logger.info(`Found an order in the collection with the name : ${orderOwner}`);
    logger.info(result);
  } else {
    logger.info(`Not found an order with the name : ${orderOwner}`);
  }
  return result;
}

export async function updateOrderByName(orderOwner, value) {
  const result = await client
    .db("RestManagerDB")
    .collection("orders")
    .updateOne({ orderOwner }, { $set: { orderOwner: value } });
  logger.info(`${result.matchedCount} document(s) matched the query criteria`);
  logger.info(`${result.modifiedCount} documents was/were updated`);
  return result;
}

export async function deleteOneOrderByName(orderOwner) {
  const result = await client.db("RestManagerDB").collection("orders").deleteOne({ orderOwner });
  logger.info(`${result.deletedCount} document(s) was/were deleted`);
  return result;
}
export async function deleteOneOrderByNumber(orderNumber) {
  const result = await client.db("RestManagerDB").collection("orders").deleteOne({ orderNumber });
  logger.info(`${result.deletedCount} document(s) was/were deleted`);
  return result;
}
