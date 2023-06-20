import { Request, Response, NextFunction } from "express";
import { reviewValidation } from "../models/review";

export const validateReview = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { error } = reviewValidation.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    next();
};
