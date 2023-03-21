import express from "express";
import bodyParser from "body-parser";

import { logger } from "./logger";
import {
  createListing,
  deleteOneListing,
  findListingByName,
  findMultListing,
  updateListingByName
} from "./mongo";

const app = express();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//first get opp is for read object by name , and second one is for read objects by date
app.get("/get1", (req, res) => {
  logger.info("new Get Req");
  findListingByName(req.query.name);
  return res.status(200).send("Hii1");
});
app.get("/get2", (req, res) => {
  logger.info("new Get Req");
  findMultListing(req.query.date);
  return res.status(200).send("Hii2");
});

//post req - create new object to mongoDB
app.post("/newUser", (req, res) => {
  logger.info("new Post Req");
  createListing({ name: req.body.name, lastName: req.body.lastName, date: req.body.date });
  return res.status(200).send("post");
});

app.put("/update", (req, res) => {
  logger.info("new Update Req");
  updateListingByName(req.body.name, req.body.value);
  logger.info(` ${req.body.name}, ${req.body.value}`);
  return res.status(200).send("update");
});

app.delete("/delete", (req, res) => {
  logger.info("new Delete Req");
  deleteOneListing(req.body.name);
  return res.status(200).send("delete");
});

app.listen(5000, () => {
  logger.info("server is up!");
});
