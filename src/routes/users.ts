import { Router } from "express";
import * as userControllers from "../controllers/users.controller";
import { validateUser } from "../middleware/validateUser";
import auth from "../middleware/auth";
import auditMiddleware from "../middleware/audit";
const router = Router();

router.route("/").post(validateUser, userControllers.create);
/**
 * @openapi
 * /user/:
 *   post:
 *     tags:
 *       - User
 *     summary: Create a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *           examples:
 *             example1:
 *               value:
 *                 firstName: john
 *                 lastName: Doe
 *                 email: user@example.com
 *                 password: password123
 *             example2:
 *               value:
 *                 firstName: john
 *                 lastName: Cent
 *                 email: cent@example.com
 *                 password: pass123
 *
 *     responses:
 *       '201':
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *             examples:
 *               example1:
 *                 value:
 *                   message: New user created successfully, we sent a mail to verify check your inbox!!
 *                   data:
 *                     email: john@example.com
 *                     name: John Doe
 *                     createdAt: '2023-06-12T12:34:56Z'
 *               example2:
 *                 value:
 *                   message: New user created successfully, we sent a mail to verify check your inbox!!
 *                   data:
 *                     email: cent@example.com
 *                     name: John Cent
 *                     createdAt: '2023-06-12T12:34:56Z'
 *
 *       '400':
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   example: "Not valid user data"
 *
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   example: An error occurred
 */

router
    .route("/verify/:verifyToken")
    .get(auth, auditMiddleware, userControllers.verifyUser);

/**
 * @openapi
 * /user/verify/{verifyToken}:
 *   get:
 *     tags:
 *       - User
 *     summary: Verify user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: x-auth-token
 *         schema:
 *            type: string
 *         description: The user token
 *         required: true
 *       - in: path
 *         name: verifyToken
 *         required: true
 *         description: Verification token
 *         schema:
 *           type: string
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
 *                   examples:
 *                     example1:
 *                       value:
 *                         message: BINGO, You are now a verified user!
 *                   example2:
 *                     value:
 *                       message: Hooray, your account is now verified!
 *
 *       '400':
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid token!
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
 *                   example: User not found!
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
 *                   example: An error occurred
 */

router.route("/me").get(auth, auditMiddleware, userControllers.getUser);

/**
 * @openapi
 * /user/me:
 *   get:
 *     tags:
 *       - User
 *     summary: Get user information
 *     parameters:
 *       - in: header
 *         name: x-auth-token
 *         schema:
 *            type: string
 *         description: The user token
 *         required: true
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponseData'
 *             examples:
 *               example1:
 *                 value:
 *                   data:
 *                     username: john_doe
 *                     email: user@example.com
 *                     createdAt: '2023-06-12T12:34:56Z'
 *               example2:
 *                 value:
 *                   data:
 *                     username: jane_smith
 *                     email: jane@example.com
 *                     createdAt: '2023-06-12T12:34:56Z'
 *
 *       '400':
 *         description: Bad Request
 *         content:
 *           application/json:
 *             example:
 *               error: "Invalid token!"
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
 *                 message:
 *                   type: string
 *                   example: User not found!
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
 *                   example: An error occurred
 */

router.route("/update").put(auth, auditMiddleware, userControllers.update);

/**
 * @openapi
 * /user/update:
 *   put:
 *     tags:
 *       - User
 *     summary: Update user information
 *     parameters:
 *       - in: header
 *         name: x-auth-token
 *         schema:
 *            type: string
 *         description: The user token
 *         required: true
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUser'
 *           examples:
 *             example1:
 *               value:
 *                 password: newpassword123
 *             example2:
 *               value:
 *                 email: newemail@example.com
 *                 firstName: John
 *                 lastName: Doe
 *
 *     responses:
 *       '201':
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 examples:
 *                   example1:
 *                     value:
 *                       message: User updated successfully
 *                       data:
 *                         firstName: John
 *                         lastName: Doe
 *                         email: newemail@example.com
 *                         updatedAt: '2023-06-12T12:34:56Z'
 *                   example2:
 *                     value:
 *                       message: User updated successfully
 *                       data:
 *                         firstName: John
 *                         lastName: Doe
 *                         email: user@example.com
 *                         updatedAt: '2023-06-12T12:34:56Z'
 *
 *       '400':
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid fields provided
 *                 invalidFields:
 *                   type: array
 *                   items:
 *                     type: string
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
 *                 message:
 *                   type: string
 *                   example: User not found
 *
 *       '409':
 *         description: Conflict
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: The new password cannot match the old password
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
 *                   example: An error occurred
 */

router.route("/reset").get(auth, auditMiddleware, userControllers.verifyReset);

/**
 * @openapi
 * /user/reset:
 *   get:
 *     tags:
 *       - User
 *     summary: Initiate password reset process
 *     parameters:
 *       - in: header
 *         name: x-auth-token
 *         schema:
 *            type: string
 *         description: The user token
 *         required: true
 *     security:
 *       - bearerAuth: []
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
 *                   example: A mail has been sent to you, check your inbox to reset your password!
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
 *                   example: Unauthorized!
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
 *                   example: User not found
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
 *                   example: An error occurred
 */

router
    .route("/reset/verify/:verifyToken")
    .post(auth, auditMiddleware, userControllers.confirmReset);

/**
 * @openapi
 * /user/reset/verify/{verifyToken}:
 *   post:
 *     tags:
 *       - User
 *     summary: Confirm password reset
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: x-auth-token
 *         schema:
 *            type: string
 *         description: The user token
 *         required: true
 *       - in: path
 *         name: verifyToken
 *         required: true
 *         description: Verification token received in the password reset email
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newPassword:
 *                 type: string
 *                 description: The new password to set
 *                 example: pass123word
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
 *                   example: BINGO, You have reset your password!
 *
 *       '400':
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
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
 *                   example: Unauthorized!
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
 *                   example: User not found
 *
 *       '409':
 *         description: Conflict
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: The new password cannot match the old password
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
 *                   example: An error occurred
 */

router.route("/admin").get(auth, auditMiddleware, userControllers.getAdmin);

/**
 * @openapi
 * /user/admin:
 *   get:
 *     tags:
 *       - User
 *     summary: make the user admin
 *     parameters:
 *       - in: header
 *         name: x-auth-token
 *         schema:
 *            type: string
 *         description: The user token
 *         required: true
 *     security:
 *       - bearerAuth: []
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
 *                   example: This user promoted successfully!
 *
 *       '400':
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
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
 *                   example: Unauthorized!
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
 *                   example: User not found
 *
 *       '409':
 *         description: Conflict
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: The new password cannot match the old password
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
 *                   example: An error occurred
 */

router
    .route("/delete")
    .delete(auth, auditMiddleware, userControllers.deleteUser);

/**
 * @openapi
 * /user/delete:
 *   delete:
 *     tags:
 *       - User
 *     summary: Delete user
 *     parameters:
 *       - in: header
 *         name: x-auth-token
 *         schema:
 *            type: string
 *         description: The user token
 *         required: true
 *     security:
 *       - bearerAuth: []
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
 *                   example: This user has been deleted successfully!
 *                 data:
 *                   type: string
 *                   example: user@example.com
 *
 *       '400':
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
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
 *                   example: Unauthorized!
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
 *                   example: User not found
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
 *                   example: An error occurred
 */

export { router as usersRouter };
