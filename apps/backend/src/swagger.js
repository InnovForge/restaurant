import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { readFileSync } from "fs";
import { logger } from "./utils/logger.js";

const packageJson = JSON.parse(readFileSync(new URL("../package.json", import.meta.url)));
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Restaurant API",
      description: "API endpoints for a restaurant services documented on swagger",
      contact: {
        name: packageJson.name,
        url: packageJson.repository.url,
      },
      version: packageJson.version,
    },
    servers: [
      {
        url: "http://localhost:3001",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        jwtCookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "accessToken",
        },
      },
    },
    security: [
      {
        jwtCookieAuth: [],
      },
    ],
  },
  // looks for configuration in specified directories
  apis: ["./src/routes/*.js"],
};
const swaggerSpec = swaggerJsdoc(options);

function swaggerDocs(app, port) {
  // Swagger Page
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  // Documentation in JSON format
  app.get("/docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  logger.info(`Swagger running on http://localhost:${port}/docs`);
}
export default swaggerDocs;
