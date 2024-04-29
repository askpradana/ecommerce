const swaggerJsDoc = require("swagger-jsdoc");
const dotenv = require("dotenv");
dotenv.config();
const url = process.env.SWAGGERURL;
const port = process.env.PORT;

const options = {
	definition: {
		openapi: "3.1.0",
		info: {
			title: "EZShop API",
			version: "0.0.1",
			description:
				"API Documentation for mock up ecommerce I create with node and prisma",
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
				url: "http://localhost:" + port,
			},
		],
	},
	apis: ["./route/*.js", "./route/items/*.js"],
};

const swaggerDocs = swaggerJsDoc(options);

module.exports = swaggerDocs;
