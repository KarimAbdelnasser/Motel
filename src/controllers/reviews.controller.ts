import { Request, Response } from "express";
import { Review } from "../models/review";
import { User } from "../models/user";
import { Reservation } from "../models/reservation";

type UserType = {
    _id: string;
};
// Controller for creating a new review
export const createReview = async (
    req: Request & { user?: UserType },
    res: Response
): Promise<void | Response> => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { roomId, rating, reviewText } = req.body;
        const userId = req.user._id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const reservation = await Reservation.findOne({
            userId: req.user._id,
            roomId: roomId,
        });
        if (!reservation || reservation.checkOut === false) {
            return res.status(404).json({
                error: "You can't make a review without trying the room first!",
            });
        }

        const review = new Review({
            userId: req.user._id,
            roomId: roomId,
            rating: rating,
            reviewText: reviewText,
        });

        await review.save();

        return res.status(201).json({
            message: "Review created successfully",
            review,
        });
    } catch (error) {
        console.error("Error creating review:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Controller for getting all reviews
export const getReviews = async (
    req: Request & { user?: UserType },
    res: Response
): Promise<void | Response> => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const reviews = await Review.find({ userId: req.user._id });

        return res.status(200).json({
            message: "Reviews retrieved successfully",
            reviews: reviews,
        });
    } catch (error) {
        console.error("Error retrieving reviews:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Controller for getting a specific review by ID
export const getReviewById = async (
    req: Request & { user?: UserType },
    res: Response
): Promise<void | Response> => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const { id } = req.params;

        const review = await Review.findById(id);

        if (!review) {
            return res.status(404).json({ error: "Review not found" });
        }

        if (review.userId !== req.user._id) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        res.status(200).json({
            message: "Review retrieved successfully",
            review: review,
        });
    } catch (error) {
        console.error("Error retrieving review:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Controller for updating a specific review by ID
export const updateReviewById = async (
    req: Request & { user?: UserType },
    res: Response
): Promise<void | Response> => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const { id } = req.params;
        const { value } = req.body;
        const current = await Review.findById(id);

        if (!current) {
            return res.status(404).json({ error: "Review not found" });
        }

        if (current.userId !== req.user._id) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const review = await Review.findByIdAndUpdate(id, {
            rating: value.rating,
            reviewText: value.reviewText,
        });

        if (!review) {
            return res.status(404).json({ error: "Review not found" });
        }

        return res.status(200).json({ message: "Review updated successfully" });
    } catch (error) {
        console.error("Error updating review:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Controller for deleting a specific review by ID
export const deleteReviewById = async (
    req: Request & { user?: UserType },
    res: Response
): Promise<void | Response> => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const { id } = req.params;

        const review = await Review.findByIdAndDelete(id);

        if (!review) {
            res.status(404).json({ error: "Review not found" });
            return;
        }

        if (review.userId !== req.user._id) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        res.status(200).json({ message: "Review deleted successfully" });
    } catch (error) {
        console.error("Error deleting review:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
