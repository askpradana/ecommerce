const express = require("express");
const app = express();
const port = 3000;
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();
const bodyParser = require("body-parser");
app.use(bodyParser.json());

app.post("/login", async function (req, res) {
	const email = req.body.email;
	const hashedPassword = await bcrypt.hash(req.body.password, 10);
	const user = await prisma.user.findUnique({
		where: {
			userEmail: email,
		},
	});
	const userPassword = user.password;
	const result = bcrypt.compareSync(req.body.password, userPassword);
	console.log(result);
	if (user) {
		res.send(user);
	} else {
		res.status(401).send(hashedPassword);
	}
});

app.post("/register", async (req, res) => {
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

app.post("/profile", async (req, res) => {
	const id = req.body.id;
	const user = await prisma.profile.findFirst({
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

app.post("/profile/add", async (req, res) => {
	const { id, address, gender, phone, email } = req.body;
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
});

app.get("/", async (req, res) => {
	const users = await prisma.user.findMany();
	res.send(users);
});

app.post("/add", async (req, res) => {
	const { name, email } = req.body;
	const user = await prisma.user.create({
		data: {
			name,
			userEmail: email,
		},
	});
	res.send(user);
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
