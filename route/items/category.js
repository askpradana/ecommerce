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
