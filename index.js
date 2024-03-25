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

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
