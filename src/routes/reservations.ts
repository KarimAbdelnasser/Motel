import { Router } from "express";
import * as reservationControllers from "../controllers/reservations.controller";
import { validateReservation } from "../middleware/validateReservation";
import auth from "../middleware/auth";

const router = Router();

router.route("/new").post(auth, reservationControllers.createReservation);

/**
 * @openapi
 * /reservation/new:
 *   post:
 *     tags:
 *       - Reservation
 *     summary: Create a new reservation
 *     parameters:
 *       - in: header
 *         name: x-auth-token
 *         schema:
 *            type: string
 *         description: The user token
 *         required: true
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *               floor:
 *                 type: number
 *               capacity:
 *                 type: number
 *               startDate:
 *                 type: string
 *                 format: date
 *               duration:
 *                 type: number
 *             example:
 *               type: single
 *               floor: 2
 *               capacity: 1
 *               startDate: 2023-06-20
 *               duration: 3
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
 *                   example: Reservation created successfully
 *                 reservationInfo:
 *                   type: object
 *                   properties:
 *                     roomId:
 *                       type: string
 *                       example: 617d6e35288c2e4e301e7ad3
 *                     startDate:
 *                       type: string
 *                       format: date
 *                       example: 2023-06-20
 *                     endDate:
 *                       type: string
 *                       format: date
 *                       example: 2023-06-23
 *
 *       '400':
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   example: Not valid reservation data or Invalid token!
 *
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized
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
 *                   example: No available rooms found
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

router.route("/getAll").get(auth, reservationControllers.getReservations);

/**
 * @openapi
 * /reservation/getAll:
 *   get:
 *     tags:
 *       - Reservation
 *     summary: Get all reservations of the authenticated user
 *     parameters:
 *       - in: header
 *         name: x-auth-token
 *         schema:
 *            type: string
 *         description: The user token
 *         required: true
 *     security:
 *       - BearerAuth: []
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
 *                   example: Reservations retrieved successfully
 *                 reservations:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/GrtReservationsResponse'
 *
 *       '400':
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   example: Invalid token!
 *
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized
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
 *                   example: No reservations found!
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
    .route("/getById/:id")
    .get(auth, reservationControllers.getReservationById);

/**
 * @openapi
 * /reservation/getById/{id}:
 *   get:
 *     tags:
 *       - Reservation
 *     summary: Get a reservation by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Reservation ID
 *       - in: header
 *         name: x-auth-token
 *         schema:
 *            type: string
 *         description: The user token
 *         required: true
 *     security:
 *       - BearerAuth: []
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
 *                   example: Reservation retrieved successfully
 *                 reservation:
 *                   $ref: '#/components/schemas/GrtReservationByIdResponse'
 *
 *       '400':
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   example: Invalid token!
 *
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized
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
 *                   example: Reservation not found
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
    .put(auth, reservationControllers.updateReservationById);

/**
 * @openapi
 * /reservation/update/{id}:
 *   put:
 *     tags:
 *       - Reservation
 *     summary: Update a reservation by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Reservation ID
 *       - in: header
 *         name: x-auth-token
 *         schema:
 *            type: string
 *         description: The user token
 *         required: true
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *               capacity:
 *                 type: number
 *               startDate:
 *                 type: string
 *                 format: date
 *               duration:
 *                 type: number
 *             example:
 *               type: single
 *               capacity: 1
 *               startDate: 2023-07-20
 *               duration: 3
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
 *                   example: Reservation updated successfully
 *                 reservation:
 *                   $ref: '#/components/schemas/Reservation'
 *
 *       '400':
 *         description: Bad request or room not available
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: No available room found with the specified specifications or Not valid reservation data or Invalid token!
 *
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized
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
 *                   example: Reservation not found
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

router.route("/checkIn").put(auth, reservationControllers.checkIn);

/**
 * @openapi
 * /reservation/checkIn:
 *   put:
 *     tags:
 *       - Reservation
 *     summary: Check-in a reservation
 *     parameters:
 *       - in: header
 *         name: x-auth-token
 *         schema:
 *            type: string
 *         description: The user token
 *         required: true
 *     security:
 *       - BearerAuth: []
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
 *                   example: You have checked in!
 *
 *       '400':
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   example: Invalid token!
 *
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized
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
 *                   example: Reservation not found
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

router.route("/checkOut").put(auth, reservationControllers.checkOut);

/**
 * @openapi
 * /reservation/checkOut:
 *   put:
 *     tags:
 *       - Reservation
 *     summary: Check-out reservations
 *     parameters:
 *       - in: header
 *         name: x-auth-token
 *         schema:
 *            type: string
 *         description: The user token
 *         required: true
 *     security:
 *       - BearerAuth: []
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
 *                   example: You have checked out!
 *
 *       '400':
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   example: Invalid token!
 *
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized
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
 *                   example: No reservations found for check-out
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
    .route("/cancel/:id")
    .delete(auth, reservationControllers.cancelReservationById);

/**
 * @openapi
 * /reservation/cancel/{id}:
 *   delete:
 *     tags:
 *       - Reservation
 *     summary: Cancel a reservation by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Reservation ID
 *       - in: header
 *         name: x-auth-token
 *         schema:
 *            type: string
 *         description: The user token
 *         required: true
 *     security:
 *       - BearerAuth: []
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
 *                   example: Reservation cancelled successfully
 *
 *       '400':
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   example: Invalid token!
 *
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized
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
 *                   example: Reservation not found
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

export { router as reservationsRouter };
