const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");

// get config vars
dotenv.config();

const prisma = new PrismaClient();
const tokenChecker = async function (req, res, next) {
	const { email } = req.body;
	const token = req.headers.authorization;

	if (!token || !email)
		return res.status(400).send({ message: "Please Provide token and email" });

	const tokenIsValid = await prisma.user.findUnique({
		where: {
			userEmail: email,
		},
		select: {
			token: true,
		},
	});

	if (!tokenIsValid) return res.status(401).send({ message: "token invalid" });

	const tokenIsCorrect = bcrypt.compareSync(token, tokenIsValid.token);

	if (tokenIsCorrect == false)
		return res.status(401).send({ message: "incorrect token" });

	try {
		jwt.verify(token, process.env.TOKEN_SECRET);
	} catch {
		return res.status(401).send({ message: "token expired" });
	}

	next();
};

module.exports = tokenChecker;
