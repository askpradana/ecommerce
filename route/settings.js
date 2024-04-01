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
const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function tokenChcker(params) {
	const { email, token } = params;

	if (!token || !email) return "param invalid";

	const tokenIsValid = await prisma.user.findUnique({
		where: {
			userEmail: email,
		},
		select: {
			token: true,
		},
	});

	if (!tokenIsValid) return "token invalid";

	const tokenIsCorrect = bcrypt.compareSync(token, tokenIsValid.token);

	if (!tokenIsCorrect) return "incorrect token";

	return "next";
}

router.post("/profile", async (req, res) => {
	const { email } = req.body;
	const token = req.headers.authorization;

	const checkToken = await tokenChcker({ email, token });

	if (checkToken !== "next")
		return res.status(401).send({ message: checkToken });

	const checkProfile = await prisma.profile.findUnique({
		where: {
			profileEmail: email,
		},
	});

	if (!checkProfile) return res.send({ message: "profile not available" });

	return res.send({ message: "to homepage" });
});

router.post("/profile/add", async (req, res) => {
	const { id, address, gender, phone, email } = req.body;
	const token = req.headers.authorization;

	const checkToken = await tokenChcker({ email, token });

	if (checkToken !== "next")
		return res.status(401).send({ message: checkToken });

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
