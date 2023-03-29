import {
  createListing,
  deleteOneListing,
  findMultUsers,
  updateUser
} from "../crud/usersCollection";
import { app } from "../index";
import { logger } from "../logger";

/**
 * @swagger
 *  /users/create:
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
 *              -heName
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
 *              heName:
 *                type: string
 *                default: אריאל
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
 *               heName:
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
 *    operationId: createListing
 */
app.post("/users/create", async (req, res) => {
  try {
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
      userNumber: req.body.userNumber,
      heName: req.body.heName
    });
    return res.status(200).json({ message: "Successfully Registered", response });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

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
