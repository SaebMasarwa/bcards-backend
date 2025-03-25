# BCard API

## Overview

The BCard API provides endpoints for managing users and business cards. Below are the main functionalities:

- **User Authentication**: Endpoints for user registration, login, and token verification.
- **Card Management**: Endpoints for creating, updating, deleting, and retrieving business cards.
- **User Management**: Endpoints for managing user roles and permissions.
- **Search**: Endpoints for searching cards by various criteria.

## Features

- **User Authentication**: Secure login and registration system.
- **Card Management**: Create, edit, and delete business cards.

## Technologies Used

- **JWT**: JSON Web Tokens for secure authentication.
- **Node.js**: Backend runtime environment.
- **Express**: Web framework for Node.js.
- **MongoDB**: NoSQL database for storing card data.

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/SaebMasarwa/bcards-backend.git
   ```
2. Navigate to the project directory:
   ```sh
   cd bcards-backend
   ```
3. Install dependencies:
   ```sh
   npm install
   ```
4. Start the server:
   ```sh
   npm start
   ```

## Usage

After starting the server, you can access the API at `http://localhost:8000`. Use tools like Postman to interact with the endpoints.

## Endpoints

### User Authentication

- `POST /users`: Register a new user.
- `POST /users/login`: Login a user.

### Card Management

- `POST /cards`: Create a new business card.
- `GET /cards`: Retrieve all business cards.
- `GET /cards/my-cards`: Retrieve all logged in user business cards.
- `GET /cards/:id`: Retrieve a specific business card.
- `PUT /cards/:id`: Update a business card details.
- `PATCH /cards/:id`: Update a business card like status for logged in user.
- `DELETE /cards/:id`: Delete a business card.

### User Management

- `GET /users/`: Retrieve all users.
- `GET /users/:id`: Retrieve a specific user.
- `PUT /users/:id`: Update a user details.
- `PATCH /users/:id`: Change users isBusiness status.
- `DELETE /users/:id`: Delete a user.
