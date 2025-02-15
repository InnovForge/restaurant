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
      responses: {
        200: {
          description: "Success",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: { type: "string", example: "success" },
                  code: { type: "integer", example: 200 },
                  message: {
                    type: "string",
                    example: "Your request was processed successfully.",
                  },
                  data: { type: "object" },
                },
              },
            },
          },
        },
        201: {
          description: "Created",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: { type: "string", example: "success" },
                  code: { type: "integer", example: 201 },
                  message: {
                    type: "string",
                    example: "Your request was successful. The resource has been created.",
                  },
                  data: { type: "object" },
                },
              },
            },
          },
        },
        400: {
          description: "Bad Request",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: { type: "string", example: "error" },
                  code: { type: "integer", example: 400 },
                  message: {
                    type: "string",
                    example: "Invalid request. Some required parameters are missing or incorrect.",
                  },
                  errors: {
                    type: "array",
                    example: [{ field1: "message1" }, { field2: "message2" }],
                  },
                },
              },
            },
          },
        },
        401: {
          description: "Unauthorized",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: { type: "string", example: "error" },
                  code: { type: "integer", example: 401 },
                  message: {
                    type: "string",
                    example: "Authentication required. Please log in.",
                  },
                  errorType: { type: "string", example: "AUTH_ERROR" },
                },
              },
            },
          },
        },

        403: {
          description: "Forbidden",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: { type: "string", example: "error" },
                  code: { type: "integer", example: 403 },
                  message: {
                    type: "string",
                    example: "You do not have permission to access this resource.",
                  },
                },
              },
            },
          },
        },
        404: {
          description: "Not Found",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: { type: "string", example: "error" },
                  code: { type: "integer", example: 404 },
                  message: {
                    type: "string",
                    example: "The requested resource could not be found.",
                  },
                },
              },
            },
          },
        },
        419: {
          description: "Authentication Timeout",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: { type: "string", example: "error" },
                  code: { type: "integer", example: 419 },
                  message: {
                    type: "string",
                    example: "Authentication Timeout. Please log in again.",
                  },
                },
              },
            },
          },
        },
        500: {
          description: "Internal Server Error",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: { type: "string", example: "error" },
                  code: { type: "integer", example: 500 },
                  message: {
                    type: "string",
                    example: "Something went wrong on our end.",
                  },
                },
              },
            },
          },
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
