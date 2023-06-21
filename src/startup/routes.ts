import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import { usersRouter } from "../routes/users";
import { roomsRouter } from "../routes/rooms";
import { reservationsRouter } from "../routes/reservations";
import { reviewsRouter } from "../routes/reviews";
import { morganMiddleware } from "../utilities/morganConfig";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "../utilities/swagger";
import auditMiddleware from "../middleware/audit";

export = (app: express.Application) => {
    app.use(express.json());
    app.use(morganMiddleware);
    app.use(bodyParser.json());
    app.use((req: Request, res: Response, next: NextFunction) => {
        if (req.path.startsWith("/docs") || req.path === "/user/") {
            next();
        } else {
            auditMiddleware(req, res, next);
        }
    });
    app.use("/user", usersRouter);
    app.use("/room", roomsRouter);
    app.use("/reservation", reservationsRouter);
    app.use("/review", reviewsRouter);
    // Add the Swagger UI route
    app.use(
        "/docs",
        swaggerUi.serve,
        swaggerUi.setup(swaggerSpec, {
            swaggerOptions: {
                security: [{ jwtAuth: [] }],
            },
        })
    );
    // Docs in JSON format
    app.use("/docs.json", (_req: Request, res: Response) => {
        res.setHeader("Content-Type", "application/json");
        res.send(swaggerSpec);
    });
    app.use((_req: Request, res: Response, _next: NextFunction) => {
        res.redirect("/docs");
    });
};
