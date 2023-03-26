import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import { logger } from "./logger";
import {
  createListing,
  deleteOneListing,
  findListingByName,
  findMultListing,
  updateListingByName,
  findListingByNumber
} from "./mongo";

const app = express();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(
  cors({
    origin: "*"
  })
);
//first get opp is for read object by name , and second one is for read objects by date
app.get("/get-object-by-name", async (req, res) => {
  logger.info("new Get Req");
  const response = await findListingByName(req.query.name);
  if (response) {
    return res.status(200).json({ message: "Object(s) Read Successfully", response });
  } else {
    return res.status(200).json({ message: "Object(s) Was Not Found" });
  }
});
app.get("/get-objects-by-date", async (req, res) => {
  logger.info("new Get Req");
  const response = await findMultListing(req.query.date);
  if (response.toString()) {
    return res.status(200).json({ message: "Object(s) Read Successfully", response });
  } else {
    return res.status(200).json({ message: "Object(s) Was Not Found" });
  }
});
app.get("/get-objects-by-number", async (req, res) => {
  logger.info("new Get Req");
  const response = await findListingByNumber(req.query.number);
  if (response) {
    return res.status(200).json({ message: "Object(s) Read Successfully", response });
  } else {
    return res.status(200).json({ message: "Object(s) Was Not Found" });
  }
});

//post req - create new object to mongoDB
app.post("/create-new-user", async (req, res) => {
  logger.info("new Post Req");
  const response = await createListing({
    name: req.body.name,
    lastName: req.body.lastName,
    date: req.body.date
  });
  return res.status(200).json({ message: "Successfully Registered", response });
});

app.put("/update", async (req, res) => {
  logger.info("new Update Req");
  const response = await updateListingByName(req.body.name, req.body.value);
  logger.info(` ${req.body.name}, ${req.body.value}`);
  return res.status(200).json({ message: "Successfully Updated", response });
});

app.delete("/delete", async (req, res) => {
  logger.info("new Delete Req");
  const response = await deleteOneListing(req.body.name);
  if (response.deletedCount) {
    return res.status(200).json({ message: "Successfully Deleted", response });
  } else {
    return res.status(200).json({ message: "Cannot Find Object With Specipic Name :(", response });
  }
});

app.listen(5001, () => {
  logger.info("server is up!");
});
