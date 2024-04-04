const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

// get config vars
dotenv.config();

function generateAccessToken(param) {
	return jwt.sign(param, process.env.TOKEN_SECRET, { expiresIn: "1m" });
}

function checkUserToken(param) {
	const token = param;
	const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
	return decoded;
}

module.exports = {
	generateAccessToken,
};
