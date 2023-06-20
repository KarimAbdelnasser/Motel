import { NextFunction, Request, Response } from "express";
import jwt, { Secret } from "jsonwebtoken";
import { config } from "../config/config";

export const isAdmin = (
    req: Request & { user?: any },
    res: Response,
    next: NextFunction
) => {
    try {
        const token = req.header("x-auth-token");

        if (!token) {
            return res.status(401).send("Access denied, no token provided!");
        }

        const decoded = jwt.verify(token, config.jwt as Secret);

        req.user = decoded;

        if (!req.user.isAdmin) return res.status(403).send("Access denied.");

        next();
    } catch (err: any) {
        res.status(400).send(`Invalid token! ${err.message}`);
    }
};
