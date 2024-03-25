const express = require("express");
const app = express();
const port = 3000;
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

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
