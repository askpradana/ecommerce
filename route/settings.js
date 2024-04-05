/**
 * @swagger
 * tags:
 *   name: Settings
 *   description: Settings management API
 * /protected/settings/profile:
 *   post:
 *     summary: Get profile
 *     tags: [Settings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User email
 *     responses:
 *       200:
 *         description: Return user profile
 *       400:
 *         description: Param invalid, probably no email provided
 *       401:
 *         description: Either token invalid, incorrect or expired
 *       500:
 *         description: Some server error
 * /protected/settings/profile/add:
 *   post:
 *     summary: Add profile
 *     tags: [Settings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: User id
 *               address:
 *                 type: string
 *                 description: User address
 *               gender:
 *                 type: string
 *                 description: User gender
 *               phone:
 *                 type: string
 *                 description: User phone
 *     responses:
 *       200:
 *         description: Add profile success
 *       500:
 *         description: Some server error
 *
 */

var express = require("express");
var router = express.Router();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// TODO : add payment, update profile, change password, profile address

router.post("/profile", async (req, res) => {
	const { email } = req.body;

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
	// const token = req.headers.authorization;

	// const checkToken = await tokenChcker({ email, token });

	// if (checkToken !== "next")
	// 	return res.status(401).send({ message: checkToken });

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
