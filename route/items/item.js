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
