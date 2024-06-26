/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Auth management API
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
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
 *               password:
 *                 type: string
 *                 description: User password
 *     responses:
 *       200:
 *         description: Login success
 *       500:
 *         description: Some server error
 *
 *
 *
 * /auth/register:
 *   post:
 *      summary: Register new user
 *      tags: [Auth]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                name:
 *                  type: string
 *                  description: User name
 *                email:
 *                  type: string
 *                  description: User email
 *                password:
 *                  type: string
 *                  description: User password
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
const bcrypt = require("bcrypt");
const { generateAccessToken } = require("../config/token");

const prisma = new PrismaClient();

async function CheckUserProfile(params) {
	const profileComplete = await prisma.profile.findUnique({
		where: {
			profileEmail: params,
		},
	});
	return profileComplete;
}

async function UpdateUserToken(params) {
	const hashedToken = await bcrypt.hash(params.token, 10);

	try {
		await prisma.user.update({
			where: {
				userEmail: params.email,
			},
			data: {
				token: hashedToken,
			},
		});
	} catch {
		res
			.status(500)
			.send({ message: "Something went wrong when updating the token" });
		return;
	}
}

router.post("/login", async function (req, res) {
	const { email, password } = req.body;
	const user = await prisma.user.findUnique({
		where: {
			userEmail: email,
		},
	});
	const userPassword = user.password;
	const correctPassword = bcrypt.compareSync(password, userPassword);
	if (correctPassword) {
		const token = generateAccessToken({
			email,
		});

		UpdateUserToken({ email, token });

		const profileComplete = await CheckUserProfile(email);
		if (profileComplete) {
			res.send({ message: "redirect to home", token });
		} else {
			res.send({ message: "redirect to fill profile", token });
		}
	} else {
		res.status(401).send({ message: "Invalid email or password" });
	}
});

router.post("/register", async (req, res) => {
	const { name, email, password } = req.body;
	const hashedPassword = await bcrypt.hash(password, 10);
	const user = await prisma.user.create({
		data: {
			name,
			userEmail: email,
			password: hashedPassword,
		},
		select: {
			name: true,
			userEmail: true,
		},
	});
	res.status(201).send({ message: "successfully registered", data: user });
});

module.exports = router;
