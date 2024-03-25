const express = require("express");
const app = express();
const port = 8080;
const bodyParser = require("body-parser");
app.use(bodyParser.json());
var authRoute = require("./route/auth");
var settingsRoute = require("./route/settings");
var categoryRoute = require("./route/items/category");
var itemRoute = require("./route/items/item");
var morgan = require("morgan");
app.use(morgan("dev"));

app.use("/auth", authRoute);
app.use("/settings", settingsRoute);
app.use("/categories", categoryRoute);
app.use("/items", itemRoute);

const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

const options = {
	definition: {
		openapi: "3.1.0",
		info: {
			title: "EZShop API",
			version: "0.0.1",
			description:
				"This is a simple CRUD API application made with Express and documented with Swagger",
			license: {
				name: "GNU GPLv3",
				url: "https://choosealicense.com/licenses/gpl-3.0",
			},
			contact: {
				name: "pradana",
				url: "https://nfldyprdn.com",
			},
		},
		servers: [
			{
				url: "http://localhost:8080",
			},
		],
	},
	apis: ["./route/*.js", "./route/items/*.js"],
};

const swaggerDocs = swaggerJsDoc(options);

app.use(
	"/api-docs",
	swaggerUi.serve,
	swaggerUi.setup(swaggerDocs, { explorer: true })
);

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
