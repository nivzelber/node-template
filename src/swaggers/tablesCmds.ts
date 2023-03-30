import { randomInt } from "crypto";

import { logger } from "../logger";
import {
  mongoCreateTable,
  findMultTables,
  mongoUpdateTable,
  deleteOneTable
} from "../crud/tablesCollection";

export const createTable = async (req, res) => {
  try {
    logger.info("new Post Req");
    if (!req.body.table_id || !req.body.shape || !req.body.owner) {
      logger.info("Unsuccessfully Registered :( , one of the body parameters is null");
      return res
        .status(404)
        .json({ message: "Unsuccessfully Registered :( , one of the body parameters is null" });
    }
    const response = await mongoCreateTable({
      table_id: req.body.table_id,
      shape: req.body.shape,
      owner: req.body.owner,
      x: randomInt(0, 100).toString(),
      y: randomInt(0, 100).toString()
    });
    return res.status(200).json({ message: "Successfully Registered", response });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getTable = async (req, res) => {
  try {
    logger.info("new Get Req");
    const response = await findMultTables(req.query.field, req.query.value);
    if (response.length > 0) {
      return res.status(200).json({ message: "Table(s) Read Successfully", response });
    } else {
      return res.status(404).json({ message: "Table(s) Was Not Found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateTable = async (req, res) => {
  try {
    logger.info("new Update Req");
    if (!req.body.table_id || !req.body.field || !req.body.value) {
      logger.info("");
      return res
        .status(404)
        .json({ message: "Table Unsuccessfully Updated , one of the parameters is null" });
    }
    const response = await mongoUpdateTable(req.body.table_id, req.body.field, req.body.value);
    if (response.matchedCount) {
      logger.info(`${req.body.table_id}, ${req.body.field}, ${req.body.value}`);
      return res.status(200).json({ message: "Table Successfully Updated", response });
    } else {
      return res
        .status(404)
        .json({ message: "Table Unsuccessfully Updated , one of the parameters is null" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteTable = async (req, res) => {
  try {
    logger.info("new Delete Req");
    const response = await deleteOneTable(req.body.field, req.body.value);
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
