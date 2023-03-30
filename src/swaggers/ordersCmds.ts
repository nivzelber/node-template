import { logger } from "../logger";
import {
  mongoCreateOrder,
  findMultOrders,
  mongoUpdateOrder,
  deleteOneOrder
} from "../crud/ordersCollection";

export const createOrder = async (req, res) => {
  try {
    logger.info("new Post Req");
    if (
      !req.body.orderName ||
      !req.body.orderNumber ||
      !req.body.orderBody ||
      !req.body.table_id ||
      !req.body.status ||
      !req.body.time
    ) {
      return res
        .status(404)
        .json({ message: "Unsuccessfully Registered :( , one of the body parameters is null" });
    } else {
      const response = await mongoCreateOrder({
        orderName: req.body.orderName,
        orderNumber: req.body.orderNumber,
        orderBody: req.body.orderBody,
        table_id: req.body.table_id,
        status: req.body.status,
        time: req.body.time
      });
      return res.status(200).json({ message: "Order Successfully Registered", response });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getOrder = async (req, res) => {
  try {
    logger.info("new Get Req");
    const response = await findMultOrders(req.query.field, req.query.value);
    if (response.length > 0) {
      return res.status(200).json({ message: "Object(s) Read Successfully", response });
    } else {
      return res.status(404).json({ message: "Object(s) Was Not Found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateOrder = async (req, res) => {
  try {
    logger.info("new Update Req");
    if (!req.body.orderNumber || !req.body.field || !req.body.value) {
      logger.info("Unsuccessfully Updated");
      return res.status(404).json({ message: "Unsuccessfully Request" });
    } else {
      const response = await mongoUpdateOrder(req.body.orderNumber, req.body.field, req.body.value);
      if (response.matchedCount) {
        logger.info(` ${req.body.orderNumber}, ${req.body.field}, ${req.body.value}`);
        return res.status(200).json({ message: "Successfully Updated", response });
      } else {
        return res.status(404).json({ message: "Unsuccessfully Request" });
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    logger.info("new Delete Req");
    const response = await deleteOneOrder(req.body.field, req.body.value);
    if (response.deletedCount) {
      return res.status(200).json({ message: "Successfully Deleted", response });
    } else {
      return res
        .status(404)
        .json({ message: "Cannot Find Object With Specipic Value :(", response });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
