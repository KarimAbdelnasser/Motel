import { Request, Response } from "express";
import { Room } from "../models/room";

type UserType = {
    _id: string;
    isAdmin: boolean;
};

// Controller for creating a new room
export const createRoom = async (
    req: Request & { user?: UserType },
    res: Response
): Promise<void | Response> => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const { number, floor, type, capacity, price, status } = req.body;

        const room = new Room({
            number,
            floor,
            type,
            capacity,
            price,
            status,
        });

        await room.save();

        return res.status(201).json({
            message: "Room created successfully",
            room,
        });
    } catch (error) {
        console.error("Error creating room:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Controller for getting all rooms
export const getRooms = async (
    req: Request,
    res: Response
): Promise<void | Response> => {
    try {
        const rooms = await Room.find();

        if (!rooms) {
            return res.status(404).json({ error: "There isn't any room!" });
        }

        return res.status(200).json({ rooms });
    } catch (error) {
        console.error("Error retrieving rooms:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Controller for getting a specific room by ID
export const getRoomById = async (
    req: Request,
    res: Response
): Promise<void | Response> => {
    try {
        const { id } = req.params;

        const room = await Room.findById(id);

        if (!room) {
            return res.status(404).json({ error: "Room not found" });
        }

        return res.status(200).json({ room });
    } catch (error) {
        console.error("Error retrieving room:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Controller for updating a specific room by ID
export const updateRoomById = async (
    req: Request,
    res: Response
): Promise<void | Response> => {
    try {
        const { id } = req.params;
        const { number, floor, type, capacity, price, status, bookedDates } =
            req.body;

        const room = await Room.findByIdAndUpdate(id, {
            number,
            floor,
            type,
            capacity,
            price,
            status,
            bookedDates,
        });

        if (!room) {
            return res.status(404).json({ error: "Room not found" });
        }

        return res.status(200).json({ message: "Room updated successfully" });
    } catch (error) {
        console.error("Error updating room:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Controller for deleting a specific room by ID
export const deleteRoomById = async (
    req: Request,
    res: Response
): Promise<void | Response> => {
    try {
        const { id } = req.params;

        const room = await Room.findByIdAndDelete(id);

        if (!room) {
            return res.status(404).json({ error: "Room not found" });
        }

        return res.status(200).json({ message: "Room deleted successfully" });
    } catch (error) {
        console.error("Error deleting room:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const underMaintenance = async (
    req: Request,
    res: Response
): Promise<void | Response> => {
    try {
        const { id } = req.params;

        const room = await Room.findByIdAndUpdate(id, {
            status: "under maintenance",
        });

        if (!room) {
            return res.status(404).json({ error: "Room not found" });
        }

        return res
            .status(201)
            .json({ message: "Room status changed successfully!" });
    } catch (error) {
        console.error("Error deleting room:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
