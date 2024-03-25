/**
 * @swagger
 * tags:
 *   name: Items
 *   description: Item list management API
 * /items:
 *   get:
 *     summary: List all available items
 *     tags: [Items]
 *     responses:
 *       200:
 *         description: The item list
 *       500:
 *         description: Some server error
 *
 * /items/add:
 *   post:
 *      summary: Add an item
 *      tags: [Items]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                name:
 *                  type: string
 *                  description: The name of the item
 *                category:
 *                  type: string
 *                  description: The category of the item
 *                image:
 *                  type: string
 *                  description: The image of the item
 *                price:
 *                  type: number
 *                  description: The price of the item
 *                storeLocation:
 *                  type: string
 *                  description: The store location of the item
 *                storeName:
 *                  type: string
 *                  description: The store name of the item
 *      responses:
 *        201:
 *          description: The item was added
 *        500:
 *          description: Some server error
 *
 */
var express = require("express");
var router = express.Router();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

router.get("/", async function (req, res) {
	const items = await prisma.itemList.findMany();
	res.status(200).send(items);
});

router.post("/add", async function (req, res) {
	const { name, category, image, price, storeLocation, storeName } = req.body;
	const item = await prisma.itemList.create({
		data: {
			name,
			image,
			rating: 0,
			sold: 0,
			itemCategory: category,
			price,
			storeLocation,
			storeName,
		},
	});
	res.status(201).send(item);
});

module.exports = router;
