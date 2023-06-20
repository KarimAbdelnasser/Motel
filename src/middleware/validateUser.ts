import { Request, Response, NextFunction } from "express";
import { userValidation } from "../models/user";

export const validateUser = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { error } = userValidation.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    next();
};
