import { Room } from "../models/room";

const rooms = [
    {
        number: "101",
        floor: 1,
        type: "single",
        capacity: 1,
        price: 50,
        status: "available",
    },
    {
        number: "102",
        floor: 1,
        type: "single",
        capacity: 1,
        price: 60,
        status: "available",
    },
    {
        number: "103",
        floor: 1,
        type: "double",
        capacity: 2,
        price: 70,
        status: "available",
    },
    {
        number: "104",
        floor: 1,
        type: "double",
        capacity: 2,
        price: 80,
        status: "available",
    },
    {
        number: "105",
        floor: 1,
        type: "suite",
        capacity: 4,
        price: 120,
        status: "available",
    },
    {
        number: "201",
        floor: 2,
        type: "single",
        capacity: 1,
        price: 55,
        status: "available",
    },
    {
        number: "202",
        floor: 2,
        type: "single",
        capacity: 1,
        price: 65,
        status: "available",
    },
    {
        number: "203",
        floor: 2,
        type: "double",
        capacity: 2,
        price: 75,
        status: "available",
    },
    {
        number: "204",
        floor: 2,
        type: "double",
        capacity: 2,
        price: 85,
        status: "available",
    },
    {
        number: "205",
        floor: 2,
        type: "suite",
        capacity: 4,
        price: 125,
        status: "available",
    },
    {
        number: "301",
        floor: 3,
        type: "single",
        capacity: 1,
        price: 60,
        status: "available",
    },
    {
        number: "302",
        floor: 3,
        type: "single",
        capacity: 1,
        price: 70,
        status: "available",
    },
    {
        number: "303",
        floor: 3,
        type: "double",
        capacity: 2,
        price: 80,
        status: "available",
    },
    {
        number: "304",
        floor: 3,
        type: "double",
        capacity: 2,
        price: 90,
        status: "available",
    },
    {
        number: "305",
        floor: 3,
        type: "suite",
        capacity: 4,
        price: 130,
        status: "available",
    },
    {
        number: "401",
        floor: 4,
        type: "single",
        capacity: 1,
        price: 65,
        status: "available",
    },
    {
        number: "402",
        floor: 4,
        type: "single",
        capacity: 1,
        price: 75,
        status: "available",
    },
    {
        number: "403",
        floor: 4,
        type: "double",
        capacity: 2,
        price: 85,
        status: "available",
    },
    {
        number: "404",
        floor: 4,
        type: "double",
        capacity: 2,
        price: 95,
        status: "available",
    },
    {
        number: "405",
        floor: 4,
        type: "suite",
        capacity: 4,
        price: 135,
        status: "available",
    },
];

const saveRoomsToDatabase = async () => {
    try {
        const savedRooms = await Room.insertMany(rooms);

        console.log("Rooms saved to the database:", savedRooms);
    } catch (error) {
        console.error("Error saving rooms to the database:", error);
    }
};

export default saveRoomsToDatabase;
