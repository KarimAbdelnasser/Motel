import mongoose, { Schema, Document } from "mongoose";
import Joi from "joi";

interface IReservation extends Document {
    userId: string;
    roomId: string;
    startDate: Date;
    endDate: Date;
    checkIn?: boolean;
    checkOut?: boolean;
}

const reservationSchema: Schema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        roomId: {
            type: Schema.Types.ObjectId,
            ref: "Room",
            required: true,
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        checkIn: {
            type: Boolean,
            default: false,
        },
        checkOut: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const Reservation = mongoose.model<IReservation>(
    "Reservation",
    reservationSchema
);

const reservationValidation = Joi.object<IReservation>({
    userId: Joi.string(),
    roomId: Joi.string(),
    startDate: Joi.date(),
    endDate: Joi.date(),
    checkIn: Joi.boolean(),
    checkOut: Joi.boolean(),
});

/**
 * @openapi
 * components:
 *   schemas:
 *     Reservation:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *           example: abc12345-1234-1234-1234-abcdeffedcba
 *         roomId:
 *           type: string
 *           example: abc12345-1234-1234-1234-abcdeffedcba
 *         startDate:
 *           type: string
 *           format: date-time
 *           example: '2023-06-12T12:00:00Z'
 *         endDate:
 *           type: string
 *           format: date-time
 *           example: '2023-06-15T10:00:00Z'
 *         checkIn:
 *           type: boolean
 *           default: false
 *         checkOut:
 *           type: boolean
 *           default: false
 *
 *     GrtReservationsResponse:
 *       type: object
 *       properties:
 *         reservations:
 *           type: object
 *           properties:
 *             roomId:
 *               type: string
 *               example: 617d6e35288c2e4e301e7ad3
 *             startDate:
 *               type: string
 *               format: date
 *               example: 2023-06-20
 *             endDate:
 *               type: string
 *               format: date
 *               example: 2023-06-23
 *
 *     GrtReservationByIdResponse:
 *       type: object
 *       properties:
 *         reservation:
 *           type: object
 *           properties:
 *             roomId:
 *               type: string
 *               example: 617d6e35288c2e4e301e7ad3
 *             startDate:
 *               type: string
 *               format: date
 *               example: 2023-06-20
 *             endDate:
 *               type: string
 *               format: date
 *               example: 2023-06-23
 *             checkIn:
 *               type: boolean
 *               default: false
 *             checkOut:
 *               type: boolean
 *               default: false
 *
 *     UpdateReservationResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Reservation updated successfully!
 *         data:
 *           $ref: '#/components/schemas/Reservation'
 */

export { Reservation, IReservation, reservationValidation };
