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

// TODO
// perhatiin item.js ini, ada yang kena problem itemdetail itemlsit merge ngga?
// kalau aman ya tinggal npx prisma db push

router.get("/all", async function (req, res) {
	const items = await prisma.itemDetail.findMany({
		select: {
			id: true,
			name: true,
			image: true,
			rating: true,
			sold: true,
			itemCategory: true,
			price: true,
			storeLocation: true,
			storeName: true,
			// description: true // * Doesnt need description on list all
		},
	});
	if (items.length == 0) {
		res.status(404).send({ message: "No item found" });
		return;
	} else {
		res.status(200).send(items);
	}
});

router.post("/add", async function (req, res) {
	const {
		name,
		category,
		description,
		image,
		price,
		storeLocation,
		storeName,
	} = req.body;
	await prisma.itemDetail.create({
		data: {
			name,
			description,
			image,
			rating: 0,
			sold: 0,
			itemCategory: category,
			price,
			storeLocation,
			storeName,
		},
	});
	res.status(201).send({ message: "Success add item" });
});

router.post("/detail", async function (req, res) {
	const { id } = req.body;
	const item = await prisma.itemDetail.findUnique({
		where: {
			id,
		},
		select: {
			id: true,
			name: true,
			image: true,
			rating: true,
			sold: true,
			itemCategory: true,
			price: true,
			storeLocation: true,
			storeName: true,
			description: true,
		},
	});
	res.send({ item });
});

module.exports = router;
