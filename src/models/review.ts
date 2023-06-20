import mongoose, { Schema, Document } from "mongoose";
import Joi from "joi";

interface IReview extends Document {
    userId: string;
    roomId: string;
    rating: number;
    reviewText: string;
    createdAt: Date;
}

const reviewSchema = new Schema<IReview>(
    {
        userId: {
            type: String,
            required: true,
        },
        roomId: {
            type: String,
            required: true,
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        reviewText: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Review = mongoose.model<IReview>("Review", reviewSchema);

const reviewValidation = Joi.object<IReview>({
    userId: Joi.string(),
    roomId: Joi.string(),
    rating: Joi.number().min(1).max(5),
    reviewText: Joi.string(),
});

/**
 * @openapi
 * components:
 *  schemas:
 *    Review:
 *      type: object
 *      properties:
 *        userId:
 *          type: string
 *          example: abc12345-1234-1234-1234-abcdeffedcba
 *        roomId:
 *          type: string
 *          example: abc12345-1234-1234-1234-abcdeffedcba
 *        rating:
 *          type: number
 *          example: 4
 *        reviewText:
 *          type: string
 *          example: "Great hotel with excellent service!"
 *        createdAt:
 *          type: string
 *          format: date-time
 *          example: '2023-06-12T12:34:56Z'
 *
 *    ReviewUpdateInput:
 *      type: object
 *      properties:
 *        rating:
 *          type: number
 *          example: 4
 *        reviewText:
 *          type: string
 *          example: "Great hotel with excellent service!"
 */

export { Review, reviewValidation };
