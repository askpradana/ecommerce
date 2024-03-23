const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
app.use(bodyParser.json());
var authRoute = require("./route/auth");

app.use("/auth", authRoute);

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
