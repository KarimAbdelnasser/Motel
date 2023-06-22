import { Router } from "express";
import * as reviewControllers from "../controllers/reviews.controller";
import { validateReview } from "../middleware/validateReview";
import auth from "../middleware/auth";
import auditMiddleware from "../middleware/audit";

const router = Router();

router
    .route("/new")
    .post(
        auth,
        auditMiddleware,
        validateReview,
        reviewControllers.createReview
    );

/**
 * @openapi
 * /review/new:
 *   post:
 *     tags:
 *       - Review
 *     summary: Create a new review
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
 *               value:
 *                 type: object
 *                 properties:
 *                   roomId:
 *                     type: string
 *                   rating:
 *                     type: number
 *                   reviewText:
 *                     type: string
 *             example:
 *               roomId: "649030bd2f7c515b9ea06c57"
 *               rating: 4.5
 *               reviewText: "Great experience!"
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
 *                   example: Review created successfully
 *                 review:
 *                   $ref: '#/components/schemas/Review'
 *
 *       '400':
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   example: Not valid review data or Invalid token!
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
 *                   example: User not found or You can't make a review without trying the room first!
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
    .route("/getAll")
    .get(auth, auditMiddleware, reviewControllers.getReviews);

/**
 * @openapi
 * /review/getAll:
 *   get:
 *     tags:
 *       - Review
 *     summary: Get all reviews by the authenticated user
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
 *                   example: Reviews retrieved successfully
 *                 reviews:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Review'
 *
 *       '400':
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   example: "Invalid token!"
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
    .get(auth, auditMiddleware, reviewControllers.getReviewById);

/**
 * @openapi
 * /review/getById/{id}:
 *   get:
 *     tags:
 *       - Review
 *     summary: Get a review by ID
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the review to retrieve
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
 *                   example: Review retrieved successfully
 *                 review:
 *                   $ref: '#/components/schemas/Review'
 *
 *       '400':
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   example: "Invalid token!"
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
 *                   example: Review not found
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
    .put(
        auth,
        auditMiddleware,
        validateReview,
        reviewControllers.updateReviewById
    );

/**
 * @openapi
 * /review/update/{id}:
 *   put:
 *     tags:
 *       - Review
 *     summary: Update a review by ID
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the review to update
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
 *             type: object
 *             properties:
 *               value:
 *                 $ref: '#/components/schemas/ReviewUpdateInput'
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
 *                   example: Review updated successfully
 *
 *       '400':
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   example: Not valid review data or Access denied, no token provided!
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
 *                   example: Review not found
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
    .route("/delete/:id")
    .delete(auth, auditMiddleware, reviewControllers.deleteReviewById);

/**
 * @openapi
 * /review/delete/{id}:
 *   delete:
 *     tags:
 *       - Review
 *     summary: Delete a review by ID
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the review to delete
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
 *                   example: Review deleted successfully
 *
 *       '400':
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   example: "Access denied, no token provided!"
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
 *                   example: Review not found
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

export { router as reviewsRouter };
