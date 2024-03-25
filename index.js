const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
app.use(bodyParser.json());
var authRoute = require("./route/auth");
var settingsRoute = require("./route/settings");
var morgan = require("morgan");
app.use(morgan("dev"));

app.use("/auth", authRoute);
app.use("/settings", settingsRoute);

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
