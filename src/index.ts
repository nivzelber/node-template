import path from "path";
import fs from "fs";
import { randomInt } from "crypto";

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const rootDir = path.resolve(__dirname, "../");
const pkgJsonPath = path.join(rootDir, "package.json");

const pkgJsonContent = fs.readFileSync(pkgJsonPath, "utf8");
const pkgJson = JSON.parse(pkgJsonContent);

const version = pkgJson.version;

import { logger } from "./logger";
import {
  createListing,
  deleteOneListing,
  findListingByName,
  findMultListing,
  updateListingByName,
  findListingByNumber
} from "./crud/usersCollection";
import {
  createOrder,
  findOrderByNumber,
  findOrderByName,
  updateOrderByName,
  deleteOneOrderByName,
  deleteOneOrderByNumber
} from "./crud/ordersCollection";
import {
  createTable,
  findTableById,
  findTableByName,
  findMultTables,
  updateTableByName,
  updateTableById,
  deleteOneTableByName,
  deleteOneTableById
} from "./crud/tablesCollection";

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

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: " Node JS API project for mongoDB",
      version
    },
    servers: [
      {
        url: "http://localhost:5001/"
      }
    ]
  },
  apis: ["./src/index.ts"]
};

const swaggerSpec = swaggerJSDoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 *  /users/create-new-user:
 *  post:
 *    tags:
 *    - Users
 *    summary: Create New User
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              -name
 *              -userNumber
 *              -userType
 *            properties:
 *              name:
 *                type: string
 *                default: Ariel
 *              userNumber:
 *                type: string
 *                default: 2402
 *              userType:
 *                type: string
 *                default: Admin
 *    responses:
 *      200:
 *        description: Object Create Successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *               name:
 *                 type: string
 *               userNumber:
 *                 type: string
 *               userType:
 *                 type: string
 *      404:
 *        description: Request Denied
 *        content:
 *          application/json:
 *            schema:
 *    operationId: createListing
 */
app.post("/users/create-new-user", async (req, res) => {
  logger.info("new Post Req");
  if (!req.body.name || !req.body.userType || !req.body.userNumber) {
    logger.info("Unsuccessfully Registered :( , one of the body parameters is null");
    return res
      .status(404)
      .json({ message: "Unsuccessfully Registered :( , one of the body parameters is null" });
  }
  const response = await createListing({
    name: req.body.name,
    userType: req.body.userType,
    userNumber: req.body.userNumber
  });
  return res.status(200).json({ message: "Successfully Registered", response });
});

/**
 * @swagger
 * /users/get-object-by-name:
 *   get:
 *     summary: Get object(s) by name
 *     tags:
 *      - Users
 *     parameters:
 *       - name: name
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *         description: The name of the object(s) to retrieve
 *     responses:
 *       200:
 *         description: Object(s) Read Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 response:
 *                   type: object
 *       404:
 *         description: Object(s) not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *     operationId: findListingByName
 */
app.get("/users/get-object-by-name", async (req, res) => {
  logger.info("new Get Req");
  const response = await findListingByName(req.query.name);
  if (response) {
    return res.status(200).json({ message: "Object(s) Read Successfully", response });
  } else {
    return res.status(404).json({ message: "Object(s) Was Not Found" });
  }
});

/**
 * @swagger
 * /users/get-objects-by-type:
 *   get:
 *     summary: Get object(s) by Type
 *     tags:
 *      - Users
 *     parameters:
 *       - name: userType
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *         description: The Type of the user to retrieve
 *     responses:
 *       200:
 *         description: Object(s) Read Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 response:
 *                   type: object
 *       404:
 *         description: Object(s) not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *     operationId: findMultListing
 */
app.get("/users/get-objects-by-type", async (req, res) => {
  logger.info("new Get Req");
  const response = await findMultListing(req.query.userType);
  if (response.toString()) {
    return res.status(200).json({ message: "Object(s) Read Successfully", response });
  } else {
    return res.status(404).json({ message: "Object(s) Was Not Found" });
  }
});
/**
 * @swagger
 * /users/get-object-by-number:
 *   get:
 *     summary: Get object(s) by number
 *     tags:
 *      - Users
 *     parameters:
 *       - name: userNumber
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *         description: The number of the object(s) to retrieve
 *     responses:
 *       200:
 *         description: Object(s) Read Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 response:
 *                   type: object
 *       404:
 *         description: Object(s) not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *     operationId: findListingByNumber
 */
app.get("/users/get-object-by-number", async (req, res) => {
  logger.info("new Get Req");
  const response = await findListingByNumber(req.query.userNumber);
  if (response) {
    return res.status(200).json({ message: "Object(s) Read Successfully", response });
  } else {
    return res.status(404).json({ message: "Object(s) Was Not Found" });
  }
});

/**
 * @swagger
 * /users/update:
 *  put:
 *    summary: Update object(s) by name
 *    tags:
 *    - Users
 *    description: The amount of object(s) to update
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *                description: The name of the user's listing to update.
 *              value:
 *                type: string
 *                description: The new value to update the user's listing with.
 *            required:
 *              - name
 *              - value
 *    responses:
 *      200:
 *        description: Object(s) Update Successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: A success message.
 *                response:
 *                  type: object
 *                  description: The updated listing.
 *      400:
 *        description: Object(s) Update Unsuccessfully :(
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: An Unsuccess message.
 *                response:
 *                  type: object
 *                  description: The updated donesn't success.
 *    operationId: updateListingByName
 */
app.put("/users/update", async (req, res) => {
  logger.info("new Update Req");
  if (!req.body.name || !req.body.value) {
    logger.info("Unsuccessfully Updated");
    return res.status(404).json({ message: "Unsuccessfully Request" });
  } else {
    const response = await updateListingByName(req.body.name, req.body.value);
    logger.info(` ${req.body.name}, ${req.body.value}`);
    return res.status(200).json({ message: "Successfully Updated", response });
  }
});

/**
 * @swagger
 * /users/delete:
 *   delete:
 *     tags:
 *     - Users
 *     summary: Deletes a user listing by name
 *     description: Deletes a user listing with the specified name from the database.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the user listing to delete.
 *             required:
 *               - name
 *     responses:
 *       200:
 *         description: Successfully deleted the user listing.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message.
 *                 response:
 *                   type: object
 *                   description: The response returned by the `deleteOneListing` function.
 *       404:
 *         description: Unable to find the user listing with the specified name.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: An error message.
 */

app.delete("/users/delete", async (req, res) => {
  logger.info("new Delete Req");
  const response = await deleteOneListing(req.body.name);
  if (response.deletedCount) {
    return res.status(200).json({ message: "Successfully Deleted", response });
  } else {
    return res
      .status(404)
      .json({ message: `Cannot Find Object With Specipic Name ${req.body.name}:( ` });
  }
});

/**
 * @swagger
 *  /orders/create-new-order:
 *  post:
 *    tags:
 *    - Orders
 *    summary: Create New order
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              -orderName
 *              -orderNumber
 *              -orderBody
 *            properties:
 *              orderName:
 *                type: string
 *                default: Ariel
 *              orderNumber:
 *                type: string
 *                default: 2402
 *              orderBody:
 *                type: string
 *                default: 1 Soda gadol , pizza zetim
 *    responses:
 *      200:
 *        description: Object Create Successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *               name:
 *                 type: string
 *               userNumber:
 *                 type: string
 *               userType:
 *                 type: string
 *      404:
 *        description: Request Denied
 *        content:
 *          application/json:
 *            schema:
 *    operationId: createOrder
 */
app.post("/orders/create-new-order", async (req, res) => {
  logger.info("new Post Req");
  if (!req.body.orderName || !req.body.orderNumber || !req.body.orderBody) {
    return res
      .status(404)
      .json({ message: "Unsuccessfully Registered :( , one of the body parameters is null" });
  } else {
    const response = await createOrder({
      orderName: req.body.orderName,
      orderNumber: req.body.orderNumber,
      orderBody: req.body.orderBody
    });
    return res.status(200).json({ message: "Order Successfully Registered", response });
  }
});

/**
 * @swagger
 * /orders/get-order-by-number:
 *   get:
 *     summary: Get order by order's number
 *     tags:
 *      - Orders
 *     parameters:
 *       - name: orderNumber
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *         description: The name of the order's number to retrieve
 *     responses:
 *       200:
 *         description: Object(s) Read Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 response:
 *                   type: object
 *       404:
 *         description: Object(s) not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *     operationId: findOrderByNumber
 */
app.get("/orders/get-order-by-number", async (req, res) => {
  logger.info("new Get Req");
  const response = await findOrderByNumber(req.query.orderNumber);
  if (response) {
    return res.status(200).json({ message: "Object(s) Read Successfully", response });
  } else {
    return res.status(404).json({ message: "Object(s) Was Not Found" });
  }
});

/**
 * @swagger
 * /orders/get-order-by-name:
 *   get:
 *     summary: Get order by order's owner
 *     tags:
 *      - Orders
 *     parameters:
 *       - name: orderOwner
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *         description: The name of the order's owner to retrieve
 *     responses:
 *       200:
 *         description: Object(s) Read Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 response:
 *                   type: object
 *       404:
 *         description: Object(s) not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *     operationId: findOrderByName
 */
app.get("/orders/get-order-by-name", async (req, res) => {
  logger.info("new Get Req");
  const response = await findOrderByName(req.query.orderOwner);
  if (response) {
    return res.status(200).json({ message: "Object(s) Read Successfully", response });
  } else {
    return res.status(404).json({ message: "Object(s) Was Not Found" });
  }
});

/**
 * @swagger
 * /orders/update:
 *  put:
 *    summary: Update Order by name
 *    tags:
 *    - Orders
 *    description: Update an order
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              orderOwner:
 *                type: string
 *                description: The name of the order's listing to update.
 *              value:
 *                type: string
 *                description: The new value to update the order's listing with.
 *            required:
 *              - name
 *              - value
 *    responses:
 *      200:
 *        description: Object(s) Update Successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: A success message.
 *                response:
 *                  type: object
 *                  description: The updated listing.
 *      400:
 *        description: Object(s) Update Unsuccessfully :(
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: An Unsuccess message.
 *                response:
 *                  type: object
 *                  description: The updated donesn't success.
 *    operationId: updateListingByName
 */
app.put("/orders/update", async (req, res) => {
  logger.info("new Update Req");
  if (!req.body.orderOwner || !req.body.value) {
    logger.info("");
    return res
      .status(404)
      .json({ message: "Order Unsuccessfully Updated , one of the parameters is null" });
  }
  const response = await updateOrderByName(req.body.orderOwner, req.body.value);
  logger.info(` ${req.body.orderOwner}, ${req.body.value}`);
  return res.status(200).json({ message: "Order Successfully Updated", response });
});

/**
 * @swagger
 * /orders/delete-order-by-name:
 *   delete:
 *     tags:
 *     - Orders
 *     summary: Deletes an order listing by name
 *     description: Deletes an order listing with the specified name from the database.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderOwner:
 *                 type: string
 *                 description: The name of the order listing to delete.
 *             required:
 *               - orderOwner
 *     responses:
 *       200:
 *         description: Successfully deleted the order listing.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message.
 *                 response:
 *                   type: object
 *                   description: The response returned by the `deleteOneOrderByName` function.
 *       404:
 *         description: Unable to find the user listing with the specified name.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: An error message.
 */
app.delete("/orders/delete-order-by-name", async (req, res) => {
  logger.info("new Delete Req");
  const response = await deleteOneOrderByName(req.body.orderOwner);
  if (response.deletedCount) {
    return res.status(200).json({ message: "Successfully Deleted", response });
  } else {
    return res.status(404).json({ message: "Cannot Find Object With Specipic Name :(", response });
  }
});
/**
 * @swagger
 * /orders/delete-order-by-number:
 *   delete:
 *     tags:
 *     - Orders
 *     summary: Deletes an order listing by number
 *     description: Deletes an order listing with the specified number from the database.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderNumber:
 *                 type: string
 *                 description: The name of the order listing to delete.
 *             required:
 *               - orderNumber
 *     responses:
 *       200:
 *         description: Successfully deleted the order listing.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message.
 *                 response:
 *                   type: object
 *                   description: The response returned by the `deleteOneOrderByNumber` function.
 *       404:
 *         description: Unable to find the user listing with the specified number.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: An error message.
 */
app.delete("/orders/delete-order-by-number", async (req, res) => {
  logger.info("new Delete Req");
  const response = await deleteOneOrderByNumber(req.body.orderNumber);
  if (response.deletedCount) {
    return res.status(200).json({ message: "Successfully Deleted", response });
  } else {
    return res
      .status(404)
      .json({ message: "Cannot Find Object With Specipic Number :(", response });
  }
});

/**
 * @swagger
 *  /tables/create-new-table:
 *  post:
 *    tags:
 *    - Tables
 *    summary: Create New table
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              -table_id
 *              -shape
 *              -owner
 *            properties:
 *              table_id:
 *                type: string
 *                default: 2
 *              shape:
 *                type: string
 *                default: round
 *              owner:
 *                type: string
 *                default: Ariel
 *    responses:
 *      200:
 *        description: Object Create Successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *               name:
 *                 type: string
 *               userNumber:
 *                 type: string
 *               userType:
 *                 type: string
 *      404:
 *        description: Request Denied
 *        content:
 *          application/json:
 *            schema:
 *    operationId: createOrder
 */
app.post("/tables/create-new-table", async (req, res) => {
  logger.info("new Post Req");
  if (!req.body.table_id || !req.body.shape || !req.body.owner) {
    logger.info("Unsuccessfully Registered :( , one of the body parameters is null");
    return res
      .status(404)
      .json({ message: "Unsuccessfully Registered :( , one of the body parameters is null" });
  }
  const response = await createTable({
    table_id: req.body.table_id,
    shape: req.body.shape,
    owner: req.body.owner,
    x: randomInt(0, 100).toString(),
    y: randomInt(0, 100).toString()
  });
  return res.status(200).json({ message: "Successfully Registered", response });
});

/**
 * @swagger
 * /tables/get-table-by-id:
 *   get:
 *     summary: Get order by table's id
 *     tags:
 *      - Tables
 *     parameters:
 *       - name: table_id
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *         description: The id of the table to retrieve
 *     responses:
 *       200:
 *         description: Object(s) Read Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 response:
 *                   type: object
 *       404:
 *         description: Object(s) not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *     operationId: findTableById
 */
app.get("/tables/get-table-by-id", async (req, res) => {
  logger.info("new Get Req");
  const response = await findTableById(req.query.table_id);
  if (response) {
    return res.status(200).json({ message: "Object(s) Read Successfully", response });
  } else {
    return res.status(404).json({ message: "Object(s) Was Not Found" });
  }
});
/**
 * @swagger
 * /tables/get-table-by-name:
 *   get:
 *     summary: Get table by table's owner
 *     tags:
 *      - Tables
 *     parameters:
 *       - name: owner
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *         description: The owner's name of the table to retrieve
 *     responses:
 *       200:
 *         description: Object(s) Read Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 response:
 *                   type: object
 *       404:
 *         description: Object(s) not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *     operationId: findTableByName
 */
app.get("/tables/get-table-by-name", async (req, res) => {
  logger.info("new Get Req");
  const response = await findTableByName(req.query.owner);
  if (response) {
    return res.status(200).json({ message: "Object(s) Read Successfully", response });
  } else {
    return res.status(404).json({ message: "Object(s) Was Not Found" });
  }
});

/**
 * @swagger
 * /tables/get-tables-by-shape:
 *   get:
 *     summary: Get tables by table's shape
 *     tags:
 *      - Tables
 *     parameters:
 *       - name: shape
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *         description: The shape of the table to retrieve
 *     responses:
 *       200:
 *         description: Object(s) Read Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 response:
 *                   type: object
 *       404:
 *         description: Object(s) not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *     operationId: findMultTables
 */
app.get("/tables/get-tables-by-shape", async (req, res) => {
  logger.info("new Get Req");
  const response = await findMultTables(req.query.shape);
  if (response.length > 0) {
    return res.status(200).json({ message: "Object(s) Read Successfully", response });
  } else {
    return res.status(404).json({ message: "Object(s) Was Not Found" });
  }
});
/**
 * @swagger
 * /tables/update-by-name:
 *  put:
 *    summary: Update Table's owner by name
 *    tags:
 *    - Tables
 *    description: Update a name of table's owner
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              owner:
 *                type: string
 *                description: The name of the table listing to update.
 *              value:
 *                type: string
 *                description: The new value to update the table listing with.
 *            required:
 *              - owner
 *              - value
 *    responses:
 *      200:
 *        description: Object(s) Update Successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: A success message.
 *                response:
 *                  type: object
 *                  description: The updated listing.
 *      400:
 *        description: Object(s) Update Unsuccessfully :(
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: An Unsuccess message.
 *                response:
 *                  type: object
 *                  description: The updated donesn't success.
 *    operationId: updateOrderByName
 */
app.put("/tables/update-by-name", async (req, res) => {
  logger.info("new Update Req");
  if (!req.body.owner || !req.body.value) {
    logger.info("");
    return res
      .status(404)
      .json({ message: "Table Unsuccessfully Updated , one of the parameters is null" });
  }
  const response = await updateTableByName(req.body.owner, req.body.value);
  logger.info(` ${req.body.owner}, ${req.body.value}`);
  return res.status(200).json({ message: "Table Successfully Updated", response });
});
/**
 * @swagger
 * /tables/update-by-id:
 *  put:
 *    summary: Update Table's id by id
 *    tags:
 *    - Tables
 *    description: Update an id of table
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              table_id:
 *                type: string
 *                description: The id of the table listing to update.
 *              value:
 *                type: string
 *                description: The new value to update the table listing with.
 *            required:
 *              - table_id
 *              - value
 *    responses:
 *      200:
 *        description: Object(s) Update Successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: A success message.
 *                response:
 *                  type: object
 *                  description: The updated listing.
 *      400:
 *        description: Object(s) Update Unsuccessfully :(
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: An Unsuccess message.
 *                response:
 *                  type: object
 *                  description: The updated donesn't success.
 *    operationId: updateTableById
 */
app.put("/tables/update-by-id", async (req, res) => {
  logger.info("new Update Req");
  if (!req.body.table_id || !req.body.value) {
    logger.info("");
    return res
      .status(404)
      .json({ message: "Table Unsuccessfully Updated , one of the parameters is null" });
  }
  const response = await updateTableById(req.body.table_id, req.body.value);
  logger.info(` ${req.body.table_id}, ${req.body.value}`);
  return res.status(200).json({ message: "Table Successfully Updated", response });
});

/**
 * @swagger
 * /tables/delete-table-by-name:
 *   delete:
 *     tags:
 *     - Tables
 *     summary: Deletes an table listing by name
 *     description: Deletes an table listing with the specified name from the database.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               owner:
 *                 type: string
 *                 description: The name of the table listing to delete.
 *             required:
 *               - owner
 *     responses:
 *       200:
 *         description: Successfully deleted the tables listing.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message.
 *                 response:
 *                   type: object
 *                   description: The response returned by the `deleteOneTableByName` function.
 *       404:
 *         description: Unable to find the table listing with the specified table.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: An error message.
 */
app.delete("/tables/delete-table-by-name", async (req, res) => {
  logger.info("new Delete Req");
  const response = await deleteOneTableByName(req.body.owner);
  if (response.deletedCount) {
    return res.status(200).json({ message: "Successfully Deleted", response });
  } else {
    return res.status(404).json({ message: "Cannot Find Object With Specipic Name :(", response });
  }
});
/**
 * @swagger
 * /tables/delete-table-by-id:
 *   delete:
 *     tags:
 *     - Tables
 *     summary: Deletes an table listing by id
 *     description: Deletes an table listing with the specified id from the database.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               table_id:
 *                 type: string
 *                 description: The name of the table listing to delete.
 *             required:
 *               - table_id
 *     responses:
 *       200:
 *         description: Successfully deleted the tables listing.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message.
 *                 response:
 *                   type: object
 *                   description: The response returned by the `deleteOneTableById` function.
 *       404:
 *         description: Unable to find the table listing with the specified id.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: An error message.
 */
app.delete("/tables/delete-table-by-id", async (req, res) => {
  logger.info("new Delete Req");
  const response = await deleteOneTableById(req.body.table_id);
  if (response.deletedCount) {
    return res.status(200).json({ message: "Successfully Deleted", response });
  } else {
    return res.status(404).json({ message: "Cannot Find Object With Specipic Name :(", response });
  }
});

app.listen(5001, () => {
  logger.info("server is up!");
});
