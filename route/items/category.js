/**
 * @swagger
 * tags:
 *   name: Items
 *   description: Item list management API
 * /categories:
 *   get:
 *     summary: List all available category
 *     tags: [Items]
 *     responses:
 *       200:
 *         description: The item list
 *       500:
 *         description: Some server error
 *
 * /categories/add:
 *   post:
 *      summary: Add an category
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
 *                  description: The name of the category
 *                routeName:
 *                  type: string
 *                  description: Im not sure what to do with this, yet
 *
 *      responses:
 *        201:
 *          description: The category was added
 *        500:
 *          description: Some server error
 *
 */

var express = require("express");
var router = express.Router();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

router.get("/", async function (req, res) {
	const categories = await prisma.kategoriList.findMany();
	res.status(200).send(categories);
});

router.post("/add", async function (req, res) {
	const { name, routeName } = req.body;
	const category = await prisma.kategoriList.create({
		data: {
			name,
			routeName,
		},
	});
	res.status(200).send(category);
});

module.exports = router;
