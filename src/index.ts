import express from "express";
import bodyParser from "body-parser";

import { logger } from "./logger";
import { createListing } from "./mongo";

const app = express();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.get("/get", (req, res) => {
  logger.info("new Get Req");
  return res.status(200).send("Hii");
});

app.post("/user", (req, res) => {
  logger.info("new Post Req");
  createListing({ name: req.body.name, lastName: req.body.lastName, date: req.body.date });
  return res.status(200).send("post");
});

app.listen(5000, () => {
  logger.info("server is up!");
});
