import { Request, Response, NextFunction } from "express";
import { reservationValidation } from "../models/reservation";

export const validateReservation = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { error } = reservationValidation.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    next();
};
