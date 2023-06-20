import { Request, Response } from "express";
import { Reservation } from "../models/reservation";
import { Room } from "../models/room";
import { User } from "../models/user";

type UserType = {
    _id: string;
};

// Controller for make a reservation and choosing room
export const createReservation = async (
    req: Request & { user?: UserType },
    res: Response
): Promise<void | Response> => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const userId = req.user._id;
        const { startDate, duration, type, floor, capacity } = req.body;

        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + duration);

        const query: any = {
            status: "available",
            bookedDates: {
                $not: {
                    $elemMatch: {
                        startDate: { $lt: endDate },
                        endDate: { $gt: startDate },
                    },
                },
            },
        };

        if (type) {
            query.type = type;
        }

        if (floor) {
            query.floor = floor;
        }

        if (capacity) {
            query.capacity = capacity;
        }

        const room = await Room.findOne(query);

        if (!room) {
            return res.status(404).json({ error: "No available rooms found" });
        }

        const reservation = new Reservation({
            userId,
            roomId: room._id,
            startDate,
            endDate,
        });

        await reservation.save();

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (!user.reservations) {
            user.reservations = [];
        }

        user.reservations.push(reservation._id);
        await user.save();

        if (!room.bookedDates) {
            room.bookedDates = [];
        }

        room.bookedDates.push({ startDate, endDate });
        await room.save();

        return res.status(201).json({
            message: "Reservation created successfully",
            reservationInfo: {
                roomId: reservation.roomId,
                startDate: reservation.startDate,
                endDate: reservation.endDate,
            },
        });
    } catch (error) {
        console.error("Error creating reservation:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Controller for getting all reservations
export const getReservations = async (
    req: Request & { user?: UserType },
    res: Response
): Promise<void | Response> => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const userId = req.user._id;

        const reservations = await Reservation.find(
            { userId: userId },
            {
                userId: 0,
                createdAt: 0,
                updatedAt: 0,
                checkIn: 0,
                checkOut: 0,
                __v: 0,
            }
        );

        if (!reservations) {
            return res.status(404).json({ error: "No reservations found!" });
        }

        return res.status(200).json({
            message: "Reservations retrieved successfully",
            reservations: reservations,
        });
    } catch (error) {
        console.error("Error retrieving reservations:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Controller for getting a specific reservation by ID
export const getReservationById = async (
    req: Request & { user?: UserType },
    res: Response
): Promise<void | Response> => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const { id } = req.params;

        const userId = req.user._id;

        const reservation = await Reservation.findById(id, {
            __v: 0,
            _id: 0,
        });

        if (!reservation) {
            return res.status(404).json({ error: "Reservation not found" });
        }

        if (reservation.userId.toString() !== userId.toString()) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        return res.status(200).json({
            message: "Reservation retrieved successfully",
            reservation: reservation,
        });
    } catch (error) {
        console.error("Error retrieving reservation:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Controller for updating a specific reservation by ID
export const updateReservationById = async (
    req: Request & { user?: UserType },
    res: Response
): Promise<void | Response> => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { id } = req.params;
        const userId = req.user._id;
        const { type, duration, startDate, capacity } = req.body;

        const startDateFormatted = new Date(startDate);

        const reservation = await Reservation.findById(id);

        if (!reservation) {
            return res.status(404).json({ error: "Reservation not found" });
        }

        if (reservation.userId.toString() !== userId.toString()) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const endDateFormatted = new Date(startDateFormatted);
        endDateFormatted.setDate(endDateFormatted.getDate() + duration);

        // Check if the new room type and duration are available
        const newRoom = await Room.findOne({
            type,
            capacity: { $gte: capacity },
            status: "available",
            bookedDates: {
                $not: {
                    $elemMatch: {
                        $or: [
                            {
                                startDate: {
                                    $lte: startDateFormatted,
                                    $gte: endDateFormatted,
                                },
                            },
                            {
                                endDate: {
                                    $gte: startDateFormatted,
                                    $lte: endDateFormatted,
                                },
                            },
                            {
                                $and: [
                                    { startDate: { $gte: startDateFormatted } },
                                    { endDate: { $lte: endDateFormatted } },
                                ],
                            },
                        ],
                    },
                },
            },
        });

        if (!newRoom) {
            return res
                .status(404)
                .json({ error: "No available rooms matching the criteria" });
        }

        await Reservation.findByIdAndDelete(id);
        await Room.findByIdAndUpdate(reservation.roomId, {
            $pull: { bookedDates: { startDate: { $gte: startDateFormatted } } },
        });

        const newReservation = new Reservation({
            userId,
            roomId: newRoom._id,
            startDate: startDateFormatted,
            endDate: endDateFormatted,
        });

        await newReservation.save();

        await Room.findByIdAndUpdate(newRoom._id, {
            $push: {
                bookedDates: {
                    startDate: startDateFormatted,
                    endDate: endDateFormatted,
                },
            },
        });

        return res.status(200).json({
            message: "Reservation updated successfully",
            reservation: newReservation,
        });
    } catch (error) {
        console.error("Error updating reservation:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Controller for cancelling a specific reservation by ID
export const cancelReservationById = async (
    req: Request & { user?: UserType },
    res: Response
): Promise<void | Response> => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const { id } = req.params;

        const reservation = await Reservation.findByIdAndDelete(id);

        if (!reservation) {
            return res.status(404).json({ error: "Reservation not found" });
        }

        const room = await Room.findById(reservation.roomId);
        if (room) {
            if (!room.bookedDates) {
                room.bookedDates = [];
            }
            const bookedDates = room.bookedDates.filter(
                (date) =>
                    !(
                        date.startDate.getTime() ===
                            reservation.startDate.getTime() &&
                        date.endDate.getTime() === reservation.endDate.getTime()
                    )
            );
            room.bookedDates = bookedDates;
            room.status = "available";
            await room.save();
        }

        return res
            .status(200)
            .json({ message: "Reservation cancelled successfully" });
    } catch (error) {
        console.error("Error cancelling reservation:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Controller for checking in a reservation
export const checkIn = async (
    req: Request & { user?: UserType },
    res: Response
): Promise<void | Response> => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const userId = req.user._id;
        const currentDate = new Date();

        const reservation = await Reservation.findOne({
            userId: userId,
            startDate: { $lte: currentDate },
        });

        if (!reservation) {
            return res.status(404).json({ error: "Reservation not found" });
        }

        const startTime = reservation.startDate;
        const endTime = reservation.endDate;

        if (currentDate < startTime || currentDate >= endTime) {
            return res
                .status(400)
                .json({ error: "Check-in not allowed at this time" });
        }

        reservation.checkIn = true;
        await reservation.save();

        const room = await Room.findById(reservation.roomId);

        if (!room) {
            return res.status(404).json({ error: "Room not found" });
        }

        room.status = "occupied";
        await room.save();

        return res.status(200).json({
            message: "You have checked in!",
        });
    } catch (error) {
        console.error("Error checking in reservation:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Controller for checking out a reservation
export const checkOut = async (
    req: Request & { user?: UserType },
    res: Response
): Promise<void | Response> => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const userId = req.user._id;

        const currentDate = new Date();

        const reservation = await Reservation.findOne({
            userId,
            checkOut: false,
            endDate: { $gte: currentDate },
        });

        if (!reservation) {
            return res
                .status(404)
                .json({ error: "No reservation found for check-out" });
        }

        const startTime = reservation.startDate;
        const endTime = reservation.endDate;

        if (currentDate < startTime || currentDate > endTime) {
            return res
                .status(400)
                .json({ error: "Check-out not allowed at this time" });
        }

        reservation.checkOut = true;
        await reservation.save();

        const room = await Room.findById(reservation.roomId);

        if (!room) {
            return res.status(404).json({ error: "Room not found" });
        }

        room.status = "available";
        await room.save();

        return res.status(200).json({
            message: "You have checked out!",
        });
    } catch (error) {
        console.error("Error checking out reservation:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
