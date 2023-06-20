import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Motel API Docs",
            description:
                "The Motel Backend App is a web application designed to manage reservations and room availability for a motel. It provides a set of APIs that allow users to create, update, and view reservations, as well as check-in and check-out guests.",
            version: "1.0.0",
            contact: {
                name: "Karim Alaraby",
                email: "karimalaraby96@gmail.com",
            },
        },
        components: {
            securitySchemas: {
                jwtAuth: {
                    type: "apiKey",
                    in: "header",
                    bearerFormat: "JWT",
                    name: "Authorization",
                    description: "JWT token",
                },
            },
        },
        security: [
            {
                jwtAuth: [],
            },
        ],
    },
    apis: ["./src/routes/*.ts", "./src/models/*.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
