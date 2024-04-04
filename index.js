const express = require("express");
const app = express();
const port = 8080;
const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");
var morgan = require("morgan");
var authRoute = require("./route/auth");
var settingsRoute = require("./route/settings");
var categoryRoute = require("./route/items/category");
var itemRoute = require("./route/items/item");
var swaggerConfig = require("./config/swagger");

const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

// get config vars
dotenv.config();

const prisma = new PrismaClient();

// config
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(
	"/api-docs",
	swaggerUi.serve,
	swaggerUi.setup(swaggerConfig, { explorer: true })
);

const tokenChecker = async function (req, res, next) {
	const { email } = req.body;
	const token = req.headers.authorization;

	if (!token || !email)
		return res.status(401).send({ message: "param invalid" });

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

app.use("/settings", tokenChecker);

// Route
app.use("/auth", authRoute);
app.use("/settings", settingsRoute);
app.use("/categories", categoryRoute);
app.use("/items", itemRoute);

// application start
app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
