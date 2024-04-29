const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const port = process.env.PORT || 8001;
const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");
var morgan = require("morgan");
var authRoute = require("./route/auth");
var cartRoute = require("./route/items/cart");
var settingsRoute = require("./route/settings");
var categoryRoute = require("./route/items/category");
var itemRoute = require("./route/items/item");
var swaggerConfig = require("./config/swagger");
var tokenChecker = require("./config/middleware");

// config
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(
	"/api-docs",
	swaggerUi.serve,
	swaggerUi.setup(swaggerConfig, { explorer: true })
);

app.use("/protected", tokenChecker);

// Route
app.get("/", (req, res) => {
	return res.send("Hello World!");
});
app.use("/auth", authRoute);
app.use("/protected/settings", settingsRoute);
app.use("/protected/cart", cartRoute);
app.use("/categories", categoryRoute);
app.use("/items", itemRoute);

// application start
app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
