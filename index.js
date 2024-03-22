const express = require("express");
const app = express();
const port = 3000;
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bodyParser = require("body-parser");
app.use(bodyParser.json());

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
