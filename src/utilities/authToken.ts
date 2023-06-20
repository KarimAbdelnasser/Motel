import jwt, { Secret } from "jsonwebtoken";
import { config } from "../config/config";

export = function generateAuthToken(id: string, admin: boolean) {
    const token = jwt.sign({ _id: id, isAdmin: admin }, config.jwt as Secret);
    return token;
};
