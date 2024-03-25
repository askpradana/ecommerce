/**
 * @swagger
 * tags:
 *   name: Settings
 *   description: API for settings
 * /settings:
 *   get:
 *     summary: Get user profile
 *     tags: [Settings]
 *     responses:
 *       200:
 *         description: Login success
 *       500:
 *         description: Some server error
 *
 *
 *
 * /settings/profile/add:
 *   post:
 *      summary: Add new profile users
 *      tags: [Settings]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                id:
 *                  type: string
 *                  description: User id
 *                address:
 *                  type: string
 *                  description: User address
 *                gender:
 *                  type: string
 *                  description: MALE or FEMALE only
 *                phone:
 *                  type: string
 *                  description: User phone
 *                email:
 *                  type: string
 *                  description: User email
 *      responses:
 *        201:
 *          description: Success added users profile
 *        500:
 *          description: Some server error
 *
 */

var express = require("express");
var router = express.Router();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

router.post("/profile", async (req, res) => {
	const id = req.body.id;
	const user = await prisma.profile.findUnique({
		where: {
			profileID: id,
		},
	});
	if (user) {
		res.send(user);
	} else {
		// in the future, change user id to cuid instead of autoincrement
		res.send({
			message: "Profile not found, redirect to fill the profile form",
		});
	}
});

router.post("/profile/add", async (req, res) => {
	const { id, address, gender, phone, email } = req.body;
	if (gender !== "MALE" && gender !== "FEMALE") {
		res.send({ message: "Invalid gender: " + gender });
		return;
	}
	try {
		const user = await prisma.profile.create({
			data: {
				profileID: id,
				address,
				gender,
				phone,
				profileEmail: email,
			},
		});
		if (user) {
			res.send(user);
		}
	} catch (e) {
		res.send({ message: e });
	}
});

module.exports = router;
