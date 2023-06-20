import mongoose, { Schema, Document } from "mongoose";
import Joi from "joi";
import crypto from "crypto";

interface IUser extends Document {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    verificationToken?: string;
    verified: boolean;
    isAdmin: boolean;
    createdAt: Date;
    updatedAt: Date;
    generateVerificationToken(): string;
    reservations?: Schema.Types.ObjectId[];
}

const userSchema: Schema = new Schema(
    {
        firstName: {
            type: String,
            required: true,
            minlength: 2,
            maxlength: 25,
        },
        lastName: {
            type: String,
            required: true,
            minlength: 2,
            maxlength: 25,
        },
        email: {
            type: String,
            required: true,
            minlength: 5,
            maxlength: 80,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
            maxlength: 255,
        },
        verificationToken: {
            type: String,
            required: false,
        },
        verified: {
            type: Boolean,
            default: false,
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },
        reservations: [
            {
                type: Schema.Types.ObjectId,
                ref: "Reservation",
            },
        ],
        createdAt: {
            type: Date,
        },
        updatedAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

userSchema.methods.generateVerificationToken = function () {
    const verificationToken = crypto.randomBytes(8).toString("hex");
    return verificationToken;
};

const User = mongoose.model<IUser>("User", userSchema);

const userValidation = Joi.object<IUser>({
    firstName: Joi.string().min(2).max(25).required(),
    lastName: Joi.string().min(2).max(25).required(),
    email: Joi.string().email().min(5).max(80).required(),
    password: Joi.string().min(6).max(255).required(),
    verificationToken: Joi.string(),
    verified: Joi.boolean(),
    isAdmin: Joi.boolean().default(false),
});

/**
 * @openapi
 * components:
 *  schemas:
 *    User:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *          format: ObjectId
 *          example: abc12345123412341234abcdeffedcba
 *        firstName:
 *          type: string
 *          minLength: 2
 *          maxLength: 25
 *          example: John
 *        lastName:
 *          type: string
 *          minLength: 2
 *          maxLength: 25
 *          example: Doe
 *        email:
 *          type: string
 *          format: email
 *          minLength: 5
 *          maxLength: 80
 *          example: john@example.com
 *        password:
 *          type: string
 *          minLength: 6
 *          maxLength: 255
 *          example: Password123
 *        verificationToken:
 *          type: string
 *          example: abc123451234
 *        verified:
 *          type: boolean
 *          default: false
 *        createdAt:
 *          type: string
 *          format: date-time
 *          example: '2023-06-12T12:34:56Z'
 *        updatedAt:
 *          type: string
 *          format: date-time
 *          example: '2023-06-12T12:34:56Z'
 *        reservations:
 *          type: array
 *          items:
 *            $ref: '#/components/schemas/Reservation'
 *
 *    UserResponse:
 *      type: object
 *      properties:
 *        message:
 *          type: string
 *          value: New user created successfully, we sent a mail to verify check your inbox!!
 *        data:
 *          $ref: '#/components/schemas/UserResponseData'
 *
 *    UserResponseData:
 *      type: object
 *      properties:
 *        email:
 *          type: string
 *          example: john@example.com
 *        name:
 *          type: string
 *          example: John Doe
 *        createdAt:
 *          type: string
 *          format: date-time
 *          example: '2023-06-12T12:34:56Z'
 *
 *    UpdateUser:
 *      type: object
 *      properties:
 *        firstName:
 *          type: string
 *          minLength: 2
 *          maxLength: 25
 *          example: John
 *        lastName:
 *          type: string
 *          minLength: 2
 *          maxLength: 25
 *          example: Doe
 *        email:
 *          type: string
 *          format: email
 *          minLength: 5
 *          maxLength: 80
 *          example: john@example.com
 *        password:
 *          type: string
 *          minLength: 6
 *          maxLength: 255
 *          example: Password123
 *
 *    Reservation:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *          format: uuid
 *          example: abc12345-1234-1234-1234-abcdeffedcba
 *        roomId:
 *          type: string
 *          format: uuid
 *          example: abc12345-1234-1234-1234-abcdeffedcba
 *        startDate:
 *          type: string
 *          format: date
 *          example: '2023-06-12'
 *        endDate:
 *          type: string
 *          format: date
 *          example: '2023-06-15'
 *        checkIn:
 *          type: boolean
 *          example: true
 *        checkOut:
 *          type: boolean
 *          example: false
 *
 *    securitySchemes:
 *       jwtToken:
 *         type: apiKey
 *         schema: apiKey
 *         in: header
 *         name: x-auth-token
 */

export { User, userValidation, IUser };
