import { Request, Response, NextFunction } from "express";
import { validateRoom } from "../models/room";

export const roomValidate = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { error } = validateRoom.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    next();
};
