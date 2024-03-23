var express = require("express");
var router = express.Router();
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function CheckUserProfile(params) {
	const profileComplete = await prisma.profile.findUnique({
		where: {
			profileEmail: params,
		},
	});
	return profileComplete;
}

router.post("/login", async function (req, res) {
	const email = req.body.email;
	const user = await prisma.user.findUnique({
		where: {
			userEmail: email,
		},
	});
	const userPassword = user.password;
	const result = bcrypt.compareSync(req.body.password, userPassword);
	if (result) {
		const profileComplete = await CheckUserProfile(email);
		if (profileComplete) {
			res.send("complete");
		} else {
			res.send("not complete");
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
	});
	res.send(user);
});

module.exports = router;
