# SQL TALK APP API

This is the backend API for the SQL TALK APP application. It uses Node.js, Express, and PostgreSQL for the backend, and Google Cloud Storage and VertexAI for file storage and AI functionalities.

## Prerequisites

- Node.js
- PostgreSQL
- A Google Cloud account
- Vertex AI
- A JWT secret for signing JWTs
- A list of premium users

## Environment Variables

You need to set the following environment variables:

### DATABASE SETTINGS

- `DATABASE_URL`: The connection string for your PostgreSQL database.
- `DB_USER`: The username for your PostgreSQL database.
- `DB_NAME`: The name of your PostgreSQL database.
- `DB_PASSWORD`: The password for your PostgreSQL database.

### GOOGLE SETTINGS

- `GOOGLE_APPLICATION_CREDENTIALS`: The path to your Google Cloud service account key file.

### VERTEX API SETTINGS

- `MODEL_NAME`: The name of your VertexAI model.
- `PROJECT_ID`: Your Google Cloud project ID.
- `LOCATION`: The location of your VertexAI model.
- `TEMPERATURE`: The temperature for your VertexAI model.

### API SETTINGS

- `JWT_SECRET`: The secret for signing JWTs.
- `PREMIUM_USERS`: A list of premium users, they will have complete access to the app.

## Running the Application

1. Clone the repository: `https://gitlab.com/elaniin.hipolito.dev/sql-talk-app-api`
2. Set the environment variables.
3. Install the dependencies: `npm install`
4. Run the application: `npm start`

## Running the Application with Docker Compose

If you have Docker and Docker Compose installed, you can use Docker Compose to run the application and its dependencies.

1. Clone the repository: `https://gitlab.com/elaniin.hipolito.dev/sql-talk-app-api`
2. Set the environment variables.
3. Run the application with Docker Compose: `docker-compose up`. This will start your application and the PostgreSQL database in separate Docker containers. Your application will be accessible at http://localhost:3000.
4. When you're done, you can stop your application by running docker-compose down. This command will stop and remove the Docker containers

## Project Structure

- `docs/`: This directory contains documentation for the project.
- `examples/`: This directory contains example code for the functionCalling service.
- `migrations/`: This directory contains database migration files.
- `src/`: This directory contains the source code of the application.
- `src/configs/`: This directory contains the configuration files.
- `src/controllers/`: This directory contains the business logic of the application.
- `src/middleware/`: This directory contains the middleware functions.
- `src/routes/`: This directory contains the route handlers for the API endpoints.
- `src/services/`: This directory contains the service modules. Each service module encapsulates a high-level functionality of the application.
- `src/utils`: This directory contains utility modules that provide helper functions used across the application.
- `tests/`: This directory contains all test files and related testing resources.

## API Documentation

Please refer to the [API documentation](https://sql-talk-app-api.hipolito.dev/api/docs/) for more information about the API endpoints.

## Function Calling Documentation

- [Chat Documentation](docs/functionCalling/CHAT.docs.md)
- [Generate Content Documentation](docs/functionCalling/GENERATE_CONTENT.docs.md)
- [WebSocket server Documentation](docs/WEBSOCKET.docs.md)
