// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace swagger2 {
  /**
   * @swagger
   * /orders/get-order-by-number:
   *   get:
   *     summary: Get order(s) by number
   *     tags:
   *      - orders
   *     parameters:
   *       - orderNumber: orderNumber
   *         in: query
   *         required: true
   *         schema:
   *           type: string
   *         description: The number of the order(s) to retrieve
   *     responses:
   *       200:
   *         description: Object(s) Read Successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: Object(s) Read Successfully
   *                 response:
   *                   type: object
   *       404:
   *         description: Order(s) not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *     operationId: findListingByNumber
   */
}
