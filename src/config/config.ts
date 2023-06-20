import * as dotenv from "dotenv";
dotenv.config();

export const config = {
    jwt: process.env.JWT_SECRET || "defaultSecret",
    salt: process.env.SALT,
    mongodb: process.env.MONGODB_URL,
    port: process.env.PORT,
    mail: process.env.MAIL,
    mailPass: process.env.MAIL_PASS,
};
