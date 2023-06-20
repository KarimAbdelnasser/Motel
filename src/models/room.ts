import mongoose, { Schema, Document } from "mongoose";
import Joi from "joi";

interface IBookedDate {
    startDate: Date;
    endDate: Date;
}

interface IRoom extends Document {
    number: string;
    floor: number;
    type: string;
    capacity: number;
    price: number;
    status: string;
    bookedDates?: IBookedDate[];
    createdAt?: Date;
    updatedAt?: Date;
}

const bookedDateSchema = new Schema<IBookedDate>({
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
});

const roomSchema = new Schema<IRoom>(
    {
        number: {
            type: String,
            required: true,
        },
        floor: {
            type: Number,
            required: true,
        },
        //single or double or suite
        type: {
            type: String,
            required: true,
        },
        capacity: {
            type: Number,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            required: true,
            default: "available",
        },
        bookedDates: {
            type: [bookedDateSchema],
        },
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

const Room = mongoose.model<IRoom>("Room", roomSchema);

const validateRoom = Joi.object<IRoom>({
    number: Joi.string().required(),
    floor: Joi.number().required(),
    type: Joi.string().required(),
    capacity: Joi.number().required(),
    price: Joi.number().required(),
    status: Joi.string(),
    bookedDates: Joi.array().items(
        Joi.object<IBookedDate>({
            startDate: Joi.date().required(),
            endDate: Joi.date().required(),
        })
    ),
});

/**
 * @openapi
 * components:
 *  schemas:
 *    BookedDate:
 *      type: object
 *      properties:
 *        startDate:
 *          type: string
 *          format: date-time
 *          example: '2023-06-12T00:00:00Z'
 *        endDate:
 *          type: string
 *          format: date-time
 *          example: '2023-06-15T00:00:00Z'
 *
 *    Room:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *          example: abc12345-1234-1234-1234-abcdeffedcba
 *        number:
 *          type: string
 *          example: "101"
 *        floor:
 *          type: integer
 *          example: 1
 *        type:
 *          type: string
 *          example: "single"
 *        capacity:
 *          type: integer
 *          example: 2
 *        price:
 *          type: number
 *          example: 100.0
 *        status:
 *          type: string
 *          example: "available"
 *        bookedDates:
 *          type: array
 *          items:
 *            $ref: '#/components/schemas/BookedDate'
 *        createdAt:
 *          type: string
 *          format: date-time
 *          example: '2023-06-12T12:34:56Z'
 *        updatedAt:
 *          type: string
 *          format: date-time
 *          example: '2023-06-12T12:34:56Z'
 *
 *    RoomResponse:
 *      type: object
 *      properties:
 *        message:
 *          type: string
 *          example: Room created successfully!
 *        data:
 *          $ref: '#/components/schemas/Room'
 *
 *    RoomResponseData:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *          example: abc12345-1234-1234-1234-abcdeffedcba
 *        number:
 *          type: string
 *          example: "101"
 *        floor:
 *          type: integer
 *          example: 1
 *        type:
 *          type: string
 *          example: "single"
 *        capacity:
 *          type: integer
 *          example: 1
 *        price:
 *          type: number
 *          example: 100.0
 *        status:
 *          type: string
 *          example: "available"
 *        bookedDates:
 *          type: array
 *          items:
 *            $ref: '#/components/schemas/BookedDate'
 *        createdAt:
 *          type: string
 *          format: date-time
 *          example: '2023-06-12T12:34:56Z'
 *        updatedAt:
 *          type: string
 *          format: date-time
 *          example: '2023-06-12T12:34:56Z'
 *
 *    RoomUpdate:
 *      type: object
 *      properties:
 *        number:
 *          type: string
 *          example: "101"
 *        floor:
 *          type: integer
 *          example: 1
 *        type:
 *          type: string
 *          example: "single"
 *        capacity:
 *          type: integer
 *          example: 1
 *        price:
 *          type: number
 *          example: 100.0
 *        status:
 *          type: string
 *          example: "available"
 *
 *    securitySchemes:
 *       jwtToken:
 *         type: apiKey
 *         schema: apiKey
 *         in: header
 *         name: x-auth-token
 */

export { Room, IRoom, validateRoom };
