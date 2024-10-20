# Bus Ticketing API

This is an API for managing a bus ticketing platform, similar to a tap-and-pay system, implemented with **Node.js** (using **Express.js** and **TypeScript**), **Prisma** as the ORM, and **MySQL** as the database.

## Features

- User registration and authentication (JWT).
- Ability to create a bus ticket ID for users.
- Credit user bus ticket account.
- Pay for a bus ticket using available account credit.
- View current account balance.
- View transaction history with filtering by date/time.
- Transfer credits to another user's account.

## Tech Stack

- **Node.js**
- **Express.js** (with TypeScript)
- **Prisma** ORM
- **MySQL**
- **Docker** for containerization
- **JWT** for authentication

## Requirements

Ensure you have the following installed:

- **Node.js** (14.x)
- **npm** (6.x)
- **Docker** (optional but recommended for deployment)
- **MySQL**

## Project Setup

1. **Clone the repository**

    ```bash
    git clone https://github.com/your-username/bus-ticketing-api.git
    cd bus-ticketing-api

2. **Install dependencies**
    
    ```bash
    npm install

3. **Set up environment variables**
- Create a .env file in the root of the project with the following variables:
    ```bash
    DATABASE_URL="mysql://user:password@localhost:3306/bus_ticketing"
    JWT_SECRET="your-secret-key"
    PORT=3000
    
- Replace user, password, and bus_ticketing with your MySQL credentials and database name.

4. **Prisma Setup**
 - Generate Prisma client:

    ```bash
    npx run prisma:generate


 - Run the migration:

    ```bash
    npx run prisma:migrate

5. **Seed the Database**
- To add some initial data to the database (if applicable):

    ```bash
    npx prisma db seed
6. **Run the Application**
   ```bash
   npm run dev
- This command will start the server in development mode.

## API Documentation
- The API documentation is provided using Postman. You can import the Postman Collection located in the repository to explore and test the API endpoints.

**Available Endpoints**
- POST /api/auth/signup: Register a new user.
- POST /api/auth/login: Login a user and obtain a JWT token.
- POST /api/tickets/create: Create a bus ticket ID for the user.
- POST /api/tickets/credit: Credit a bus ticket account.
- POST /api/tickets/pay: Pay for a bus ticket.
- GET /api/account/balance: View current account balance.
- GET /api/transactions: View transaction history.
- POST /api/account/transfer: Transfer credits to another user.
 
**Docker**
- You can run the application inside a Docker container for production:

1. **Build the Docker image**
   ```bash
    docker build -t bus-ticketing-api .
2. **Start the container using Docker Compose**
   ```bash
   docker-compose up
- This will start both the Node.js application and MySQL database in separate containers.

**Testing**
- You can run unit and integration tests using Jest (or any testing framework you set up):

    ```bash
    npm run test

**Project Structure**
    ```bash
    .
    ├── src
    │   ├── prisma
    │   │    ├── migrations/   # Migration files for schema changes
    │   │    ├── schema.prisma # Prisma schema definition
    │   ├── controllers/  # Route controllers
    │   ├── middleware/   # Custom middleware (e.g., JWT auth)
    │   ├── routes/       # Route definitions
    │   ├── services/     # Business logic and database interactions
    │   ├── app.ts        # Main Express app
    │   ├── prismaClient.ts # Prisma client initialization
    ├── Dockerfile
    ├── docker-compose.yml
    ├── package.json
    └── README.md

**License**
- This project is licensed under the MIT License.

```css
This code is fully formatted for your `README.md` file and ready to be added to your project