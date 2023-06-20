# Motel App

This is a backend application built with TypeScript and Node.js, designed to provide a robust backend solution for managing reservations, rooms, and other essential aspects of running a successful motel business.

## Description

The Motel App is a comprehensive solution for managing reservations, rooms, and other essential aspects of running a successful motel business. Features include reservation management, room management, user authentication, booking workflow, and reporting and analytics. Take your motel business to new heights with the Motel App.

### Live on : [Motel Docs](https://motel-pi.vercel.app/docs/)

## Getting Started

To run the project locally, follow these steps:

1. Clone the repository:

    ```bash
    git clone https://github.com/KarimAbdelnasser/Motel.git
    ```

2. Install dependencies:

    ```bash
    cd Motel
    npm install
    ```

3. Configure environment variables:

Create a .env file in the project root directory and add the following environment variables:

    MONGODB_URL= # MongoDB connection URL
    JWT_SECRET= # Secret key for JWT authentication
    SALT= # Salt for password hashing
    PORT= # Port number for the server
    MAIL= # Email address for sending notifications
    MAIL_PASS= # Password for the email account

-   Make sure to provide the appropriate values for each environment variable.

4.  Build the project:

    ```bash
    npm run build
    ```

5.  Start the server:

    ```bash
    npm start
    ```

-   The server will start running on the specified port, and you can access the application at
    ```bash
    http://localhost:{PORT}.
    ```

## Prerequisites

Before running the project, ensure you have the following:

-   Node.js installed (version 14 or above)

-   MongoDB instance or connection URL

-   Email account for sending notifications

## Scripts

The following scripts are available in the project:

-   npm start: Runs the built server code using Node.js.
-   npm run dev: Runs the server in development mode using Nodemon, which automatically restarts the server on file changes.
-   npm run build: Transpiles the TypeScript code to JavaScript using the TypeScript compiler.
