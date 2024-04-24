var express = require("express");
var router = express.Router();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// TODO : Add delete from cart

router.post("/list", async function (req, res) {
	const { email } = req.body;
	const cartDetail = await prisma.cart.findUnique({
		where: {
			cartOwner: email,
		},
		include: {
			itemInCart: true,
		},
	});

	return res.send(cartDetail);
});

router.post("/add", async function (req, res) {
	const { itemID, email } = req.body;

	await prisma.cart.upsert({
		where: {
			cartOwner: email,
		},

		create: {
			cartOwner: email,
			itemInCart: {
				connect: {
					id: itemID,
				},
			},
		},

		update: {
			itemInCart: {
				connect: {
					id: itemID,
				},
			},
		},

		select: {
			cartOwner: true,
			itemInCart: true,
		},
	});

	await prisma.itemDetail.update({
		where: {
			id: itemID,
		},
		data: {
			Cart: {
				connect: {
					cartOwner: email,
				},
			},
		},
	});

	return res.status(201).send({ message: "item added to cart" });
});

module.exports = router;
