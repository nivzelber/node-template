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
import { createListing, deleteOneListing, findMultUsers, updateUser } from "./crud/usersCollection";
import { createOrder, findMultOrders, updateOrder, deleteOneOrder } from "./crud/ordersCollection";
import { createTable, findMultTables, updateTable, deleteOneTable } from "./crud/tablesCollection";

export const app = express();
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
  apis: ["./src/swaggers/usersCmds.ts", "./src/index.ts"]
};

const swaggerSpec = swaggerJSDoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /users/get:
 *   get:
 *     summary: Get user(s)
 *     tags:
 *      - Users
 *     parameters:
 *       - name: field
 *         in: query
 *         required: true
 *       - name: value
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *         description: The field of the user to retrieve
 *     responses:
 *       200:
 *         description: User(s) Read Successfully
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
 *         description: User(s) not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *     operationId: findMultListing
 */
app.get("/users/get", async (req, res) => {
  try {
    logger.info("new Get Req");
    const response = await findMultUsers(req.query.field, req.query.value);
    if (response.toString()) {
      return res.status(200).json({ message: "Object(s) Read Successfully", response });
    } else {
      return res.status(404).json({ message: "Object(s) Was Not Found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

/**
 * @swagger
 * /users/update:
 *  put:
 *    summary: Update User by field
 *    tags:
 *    - Users
 *    description: The amount of user(s) to update
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              userNumber:
 *                type: string
 *                description: The id of the user's listing to update.
 *              field:
 *                type: string
 *                description: The field of the user's listing to update.
 *              value:
 *                type: string
 *                description: The new value to update the user's listing with.
 *            required:
 *              - userNumber
 *              - field
 *              - value
 *    responses:
 *      200:
 *        description: User Update Successfully
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
 *        description: User Update Unsuccessfully :(
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
 *      500:
 *        description: Internal Server Error
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
 *    operationId: updateUser
 */
app.put("/users/update", async (req, res) => {
  try {
    logger.info("new Update Req");
    if (!req.body.userNumber || !req.body.field || !req.body.value) {
      logger.info("Unsuccessfully Updated");
      return res.status(404).json({ message: "Unsuccessfully Request" });
    } else {
      const response = await updateUser(req.body.userNumber, req.body.field, req.body.value);
      if (response.matchedCount) {
        logger.info(` ${req.body.userNumber}, ${req.body.name}, ${req.body.value}`);
        return res.status(200).json({ message: "Successfully Updated", response });
      } else {
        return res.status(404).json({ message: "Unsuccessfully Request" });
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

/**
 * @swagger
 * /users/delete:
 *   delete:
 *     tags:
 *     - Users
 *     summary: Deletes a user listing by id
 *     description: Deletes a user listing with the specified id from the database.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userNumber:
 *                 type: string
 *                 description: The id of the user listing to delete.
 *             required:
 *               - userNumber
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
 *         description: Unable to find the user listing with the specified id.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: An error message.
 *       500:
 *         description: Internal Server Error
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
  try {
    logger.info("new Delete Req");
    const response = await deleteOneListing(req.body.userNumber);
    if (response.deletedCount) {
      return res.status(200).json({ message: "Successfully Deleted", response });
    } else {
      return res
        .status(404)
        .json({ message: `Cannot Find Object With Specipic id ${req.body.name}:( ` });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

/**
 * @swagger
 *  /orders/create:
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
 *              -table_id
 *              -time
 *              -status
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
 *              table_id:
 *                type: string
 *                default: 1
 *              time:
 *                type: string
 *                default: 24:30
 *              status:
 *                type: string
 *                default: Pending
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
 *               table_id:
 *                 type: string
 *               time:
 *                 type: string
 *               status:
 *                 type: string
 *      404:
 *        description: Request Denied
 *        content:
 *          application/json:
 *            schema:
 *      500:
 *        description: Internal Server Error
 *        content:
 *          application/json:
 *            schema:
 *    operationId: createOrder
 */
app.post("/orders/create", async (req, res) => {
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
      const response = await createOrder({
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
});

/**
 * @swagger
 * /orders/get:
 *   get:
 *     summary: Get order
 *     tags:
 *      - Orders
 *     parameters:
 *       - name: field
 *         in: query
 *         required: true
 *       - name: value
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *         description: The order props to retrieve
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
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *     operationId: findMultOrders
 */
app.get("/orders/get", async (req, res) => {
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
});

/**
 * @swagger
 * /orders/update:
 *  put:
 *    summary: Update Order
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
 *              orderNumber:
 *                type: string
 *                description: The name of the order's listing to update.
 *              field:
 *                type: string
 *                description: The name of the order's listing to update.
 *              value:
 *                type: string
 *                description: The new value to update the order's listing with.
 *            required:
 *              - orderNumber
 *              - field
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
 *      500:
 *        description: Internal Server Error
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
 *    operationId: updateUser
 */
app.put("/orders/update", async (req, res) => {
  try {
    logger.info("new Update Req");
    if (!req.body.orderNumber || !req.body.field || !req.body.value) {
      logger.info("Unsuccessfully Updated");
      return res.status(404).json({ message: "Unsuccessfully Request" });
    } else {
      const response = await updateOrder(req.body.orderNumber, req.body.field, req.body.value);
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
});

/**
 * @swagger
 * /orders/delete:
 *   delete:
 *     tags:
 *     - Orders
 *     summary: Deletes an order
 *     description: Deletes an order listing with the specified field from the database.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               field:
 *                 type: string
 *                 description: The field of the order listing to delete.
 *               value:
 *                 type: string
 *                 description: The value of the order listing to delete.
 *             required:
 *               - field
 *               - value
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
 *                   description: The response returned by the `deleteOneOrder` function.
 *       404:
 *         description: Unable to find the user listing with the specified field.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: An error message.
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: An error message.
 */
app.delete("/orders/delete", async (req, res) => {
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
});

/**
 * @swagger
 *  /tables/create:
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
 *              -total_price
 *              -people_amount
 *              -status
 *              -time
 *              -comments
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
 *              total_price:
 *                type: string
 *                default: Ariel
 *              people_amount:
 *                type: string
 *                default: 280
 *              status:
 *                type: string
 *                default: 4
 *              time:
 *                type: string
 *                default: 24:30
 *              comments:
 *                type: string
 *                default: No cheese only meat
 *    responses:
 *      200:
 *        description: Object Create Successfully
 *        content:
 *          application/json:
 *            schema:
 *      404:
 *        description: Request Denied
 *        content:
 *          application/json:
 *            schema:
 *      500:
 *        description: Internal Server Error
 *        content:
 *          application/json:
 *            schema:
 *    operationId: createOrder
 */
app.post("/tables/create", async (req, res) => {
  try {
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
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

/**
 * @swagger
 * /tables/get:
 *   get:
 *     summary: Get tables
 *     tags:
 *      - Tables
 *     parameters:
 *       - name: field
 *         in: query
 *         required: true
 *       - name: value
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *         description: The props of the table to retrieve
 *     responses:
 *       200:
 *         description: Table(s) Read Successfully
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
 *         description: Table(s) not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *     operationId: findMultTables
 */
app.get("/tables/get", async (req, res) => {
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
});
/**
 * @swagger
 * /tables/update:
 *  put:
 *    summary: Update Table
 *    tags:
 *    - Tables
 *    description: Update a field in table
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              table_id:
 *                type: string
 *                description: The field of the table listing to update.
 *              field:
 *                type: string
 *                description: The field of the table listing to update.
 *              value:
 *                type: string
 *                description: The new value to update the table listing with.
 *            required:
 *              - table_id
 *              - field
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
 *      500:
 *        description: Internal Server Error
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
 *    operationId: updateTable
 */
app.put("/tables/update", async (req, res) => {
  try {
    logger.info("new Update Req");
    if (!req.body.table_id || !req.body.field || !req.body.value) {
      logger.info("");
      return res
        .status(404)
        .json({ message: "Table Unsuccessfully Updated , one of the parameters is null" });
    }
    const response = await updateTable(req.body.table_id, req.body.field, req.body.value);
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
});

/**
 * @swagger
 * /tables/delete:
 *   delete:
 *     tags:
 *     - Tables
 *     summary: Deletes a table listing
 *     description: Deletes an table listing with the specified field from the database.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               field:
 *                 type: string
 *                 description: The field of the table listing to delete.
 *               value:
 *                 type: string
 *                 description: The value of the table listing to delete.
 *             required:
 *               - field
 *               - value
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
 *       500:
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
app.delete("/tables/delete", async (req, res) => {
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
});

app.listen(5001, () => {
  logger.info("server is up!");
});
