import { Request, Response } from "express";
import { User } from "../models/user";
import generateAuthToken from "../utilities/authToken";
import { hashPassword } from "../utilities/hashPassword";
import mailSender from "../utilities/mailSender";
import bcrypt from "bcrypt";
import { logger } from "../utilities/logger";

type UserType = {
    _id: string;
    isAdmin: boolean;
};

//Create a new user
export const create = async (
    req: Request,
    res: Response
): Promise<void | Response> => {
    try {
        const { password, ...newUserData } = req.body;

        const hashedPassword = await hashPassword(password);

        newUserData.password = hashedPassword;

        const newUser = await User.create({
            ...newUserData,
            password: hashedPassword,
        });

        const verificationToken = newUser.generateVerificationToken();

        newUser.verificationToken = verificationToken;

        await newUser.save();

        const userId = newUser._id;

        const token = await generateAuthToken(userId, newUser.isAdmin);

        await mailSender(
            newUser.email,
            "Hello " +
                newUser.firstName +
                ",\n\n" +
                "Please verify your account by clicking the link: \nhttp://" +
                req.headers.host +
                "/user/verify/" +
                verificationToken +
                "/" +
                "\n\nThank You!\n"
        );

        return res
            .status(201)
            .header("x-auth-token", token)
            .json({
                message:
                    "New user created successfully, we sent a mail to verify check your inbox!",
                data: {
                    email: newUser.email,
                    name: `${newUser.firstName} ${newUser.lastName}`,
                    createdAt: newUser.createdAt,
                },
            });
    } catch (error) {
        logger.error("Error creating a new user:", (error as Error).message);
        return res.status(500).json({ error: "An error occurred" });
    }
};

//Confirm the verification
export const verifyUser = async (
    req: Request & { user?: UserType },
    res: Response
): Promise<void | Response> => {
    try {
        if (req.user) {
            const user = await User.findById(req.user._id);
            if (user) {
                if (user.verificationToken !== req.params.verifyToken) {
                    return res.status(400).json({
                        message: "Invalid verification token!",
                    });
                }
                if (user.verified === true) {
                    return res.status(409).json({
                        message: "This user already is verified!",
                    });
                }
                user.verified = true;
                return res.status(200).json({
                    message: "BINGO, You are a verified user now!",
                });
            } else {
                return res.status(404).json({ message: "User not found!" });
            }
        } else {
            return res.status(401).json({ message: "Unauthorized" });
        }
    } catch (error) {
        logger.error(
            "Error confirm verifying a user:",
            (error as Error).message
        );
        return res.status(500).json({ error: "An error occurred" });
    }
};

//Get an exist user
export const getUser = async (
    req: Request & { user?: UserType },
    res: Response
): Promise<void | Response> => {
    try {
        if (req.user) {
            const user = await User.findById(req.user._id).select(
                "firstName lastName email createdAt"
            );

            if (user) {
                return res.status(200).json({
                    data: {
                        email: user.email,
                        username: `${user.firstName} ${user.lastName}`,
                        createdAt: user.createdAt,
                    },
                });
            } else {
                return res.status(404).json({ message: "User not found!" });
            }
        } else {
            return res.status(401).json({ message: "Unauthorized" });
        }
    } catch (error) {
        logger.error("Error getting a user:", (error as Error).message);
        return res.status(500).json({ error: "An error occurred" });
    }
};

//Update user's data
export const update = async (
    req: Request & { user?: UserType },
    res: Response
): Promise<void | Response> => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { password, email, firstName, lastName } = req.body;
        const allowedFields = ["password", "email", "firstName", "lastName"];

        const invalidFields = Object.keys(req.body).filter(
            (field) => !allowedFields.includes(field)
        );

        if (invalidFields.length > 0) {
            return res.status(400).json({
                message: "Invalid fields provided",
                invalidFields,
            });
        }

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (password) {
            const isSamePassword = await bcrypt.compare(
                password,
                user.password
            );

            if (isSamePassword) {
                return res.status(409).json({
                    message: "The new password cannot match the old password",
                });
            }

            const hashedPassword = await hashPassword(password);
            user.password = hashedPassword;
        }

        if (email) {
            user.email = email;
        }

        if (firstName) {
            user.firstName = firstName;
        }
        if (lastName) {
            user.lastName = lastName;
        }

        await user.save();

        const updatedUser = {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            updatedAt: user.updatedAt,
        };

        return res.status(201).json({
            message: "User updated successfully",
            data: updatedUser,
        });
    } catch (error) {
        logger.error("Error updating a user:", (error as Error).message);
        return res.status(500).json({ error: "An error occurred" });
    }
};

// Verify reset password
export const verifyReset = async (
    req: Request & { user?: UserType },
    res: Response
): Promise<void | Response> => {
    try {
        if (req.user) {
            const user = await User.findById(req.user._id);

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            const verificationToken = user.generateVerificationToken();

            user.verificationToken = verificationToken;

            await mailSender(
                user.email,
                "Hello " +
                    user.firstName +
                    ",\n\n" +
                    "You can reset your password in here: \nhttp://" +
                    req.headers.host +
                    "/user/reset/verify/" +
                    verificationToken +
                    "/" +
                    "\n\nThank You!\n"
            );

            await user.save();

            return res.status(200).json({
                message:
                    "A mail has been sent to you , check your inbox to reset your password!",
            });
        } else {
            return res.status(401).json({ message: "Unauthorized!" });
        }
    } catch (error) {
        console.error("Error verifying resetting password process:", error);
        return res.status(500).json({ error: "An error occurred" });
    }
};

// confirm reset password process
export const confirmReset = async (
    req: Request & { user?: UserType },
    res: Response
): Promise<void | Response> => {
    try {
        if (req.user) {
            const user = await User.findById(req.user._id);
            const newPassword = req.body.newPassword;

            if (user) {
                if (user.verificationToken !== req.params.verifyToken) {
                    return res.status(400).json({
                        message: "Invalid verification token!",
                    });
                }
                if (newPassword) {
                    const isSamePassword = await bcrypt.compare(
                        newPassword,
                        user.password
                    );

                    if (isSamePassword) {
                        return res.status(409).json({
                            message:
                                "The new password cannot match the old password",
                        });
                    }

                    const hashedPassword = await hashPassword(newPassword);
                    user.password = hashedPassword;
                    user.verificationToken = undefined;
                }

                await user.save();

                return res.status(201).json({
                    message: "BINGO, You have reset your password!",
                });
            } else {
                return res.status(404).json({ message: "Not Found!" });
            }
        } else {
            return res.status(401).json({ message: "Unauthorized!" });
        }
    } catch (error) {
        console.error("Error confirm resetting password process:", error);
        return res.status(500).json({ error: "An error occurred" });
    }
};

//Delete an exist user
export const deleteUser = async (
    req: Request & { user?: UserType },
    res: Response
): Promise<void | Response> => {
    try {
        if (req.user) {
            const user = await User.findByIdAndDelete(req.user._id);

            if (user) {
                await mailSender(
                    user.email,
                    "Hello " +
                        user.firstName +
                        ",\n\n" +
                        "We're sad to see you go!"
                );

                return res.status(201).json({
                    message: "This user has been deleted successfully!",
                    data: user.email,
                });
            } else {
                return res.status(404).json({ message: "Not Found!" });
            }
        } else {
            return res.status(401).json({ message: "Unauthorized!" });
        }
    } catch (error) {
        logger.error("Error deleting a user:", (error as Error).message);
        return res.status(500).json({ error: "An error occurred" });
    }
};

export const getAdmin = async (
    req: Request & { user?: UserType },
    res: Response
): Promise<void | Response> => {
    try {
        if (req.user) {
            const user = await User.findById(req.user._id);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            if (user.isAdmin === true) {
                return res
                    .status(409)
                    .json({ error: "This user is already an admin!" });
            }

            user.isAdmin = true;

            await user.save();

            const token = await generateAuthToken(req.user._id, user.isAdmin);

            return res.status(201).header("x-auth-token", token).json({
                message: "This user promoted successfully!",
            });
        } else {
            return res.status(401).json({ message: "Unauthorized!" });
        }
    } catch (error) {
        logger.error("Error deleting a user:", (error as Error).message);
        return res.status(500).json({ error: "An error occurred" });
    }
};
