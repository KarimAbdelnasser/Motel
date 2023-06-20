import { Router } from "express";
import * as roomControllers from "../controllers/rooms.controller";
import { roomValidate } from "../middleware/validateRoom";
import { isAdmin } from "../middleware/admin";

const router = Router();

router.route("/new").post(roomValidate, isAdmin, roomControllers.createRoom);

/**
 * @openapi
 * /room/new:
 *   post:
 *     tags:
 *       - Room
 *     summary: Create a new room
 *     parameters:
 *       - in: header
 *         name: x-auth-token
 *         schema:
 *            type: string
 *         description: The user token
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Room'
 *           examples:
 *             example1:
 *               value:
 *                 number: "101"
 *                 floor: 1
 *                 type: single
 *                 capacity: 1
 *                 price: 100
 *                 status: available
 *             example2:
 *               value:
 *                 number: "201"
 *                 floor: 2
 *                 type: double
 *                 capacity: 2
 *                 price: 150
 *                 status: available
 *
 *     responses:
 *       '201':
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Room created successfully
 *                 room:
 *                   $ref: '#/components/schemas/RoomResponse'
 *
 *       '400':
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   example: "Not valid room data"
 *
 *       '403':
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   example: "Access denied."
 *
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */

router.route("/all").get(isAdmin, roomControllers.getRooms);

/**
 * @openapi
 * /room/all:
 *   get:
 *     tags:
 *       - Room
 *     summary: Get all rooms
 *     parameters:
 *       - in: header
 *         name: x-auth-token
 *         schema:
 *            type: string
 *         description: The user token
 *         required: true
 *
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 rooms:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Room'
 *
 *       '403':
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   example: "Access denied."
 *
 *       '404':
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "There isn't any room!"
 *
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */

router.route("/getById/:id").get(isAdmin, roomControllers.getRoomById);

/**
 * @openapi
 * /room/getById/{id}:
 *   get:
 *     tags:
 *       - Room
 *     summary: Get a room by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the room
 *         required: true
 *         schema:
 *           type: string
 *       - in: header
 *         name: x-auth-token
 *         schema:
 *            type: string
 *         description: The user token
 *         required: true
 *
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 room:
 *                   $ref: '#/components/schemas/Room'
 *
 *       '403':
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   example: "Access denied."
 *
 *       '404':
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Room not found
 *
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */

router
    .route("/update/:id")
    .put(isAdmin, roomValidate, roomControllers.updateRoomById);

/**
 * @openapi
 * /room/update/{id}:
 *   put:
 *     tags:
 *       - Room
 *     summary: Update a room by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the room
 *         required: true
 *         schema:
 *           type: string
 *       - in: header
 *         name: x-auth-token
 *         schema:
 *            type: string
 *         description: The user token
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RoomUpdate'
 *
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Room updated successfully
 *
 *       '403':
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   example: "Access denied."
 *
 *       '404':
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Room not found
 *
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */

router
    .route("/unavailable/:id")
    .post(isAdmin, roomControllers.underMaintenance);

/**
 * @openapi
 * /room/unavailable/{id}:
 *   post:
 *     tags:
 *       - Room
 *     summary: Change the status of a room to under maintenance
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the room
 *         required: true
 *         schema:
 *           type: string
 *       - in: header
 *         name: x-auth-token
 *         schema:
 *            type: string
 *         description: The user token
 *         required: true
 *
 *     responses:
 *       '201':
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Room status changed successfully!
 *
 *       '404':
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Room not found
 *
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */

router.route("/delete/:id").delete(isAdmin, roomControllers.deleteRoomById);

/**
 * @openapi
 * /room/delete/{id}:
 *   delete:
 *     tags:
 *       - Room
 *     summary: Delete a room by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the room
 *         required: true
 *         schema:
 *           type: string
 *       - in: header
 *         name: x-auth-token
 *         schema:
 *            type: string
 *         description: The user token
 *         required: true
 *
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Room deleted successfully
 *
 *       '403':
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   example: "Access denied."
 *
 *       '404':
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Room not found
 *
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */

export { router as roomsRouter };
