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
- `DB_HOST`: The host of your PostgreSQL database.
- `DB_NAME`: The name of your PostgreSQL database.
- `DB_PASSWORD`: The password for your PostgreSQL database.
- `DB_PORT`: The port of your PostgreSQL database.

### GOOGLE API

- `GOOGLE_APPLICATION_CREDENTIALS`: The path to your Google Cloud service account key file.

### VERTEX API SETTINGS

- `MODEL_NAME`: The name of your VertexAI model.
- `PROJECT_ID`: Your Google Cloud project ID.
- `LOCATION`: The location of your VertexAI model.
- `MAX_OUTPUT_TOKENS`: The maximum number of output tokens for your VertexAI model.
- `TEMPERATURE`: The temperature for your VertexAI model.
- `TOP_P`: The top-p value for your VertexAI model.

### API SETTINGS

- `JWT_SECRET`: The secret for signing JWTs.
- `PREMIUM_USERS`: A list of premium users, they will have complete access to the app.

### PGADMIN SETTINGS

#### ONLY IF USING WITH DOCKER COMPOSE

- `PGADMIN_DEFAULT_EMAIL`: Your email for PgAdmin.
- `PGADMIN_DEFAULT_PASSWORD`: Your password for PgAdmin.

## Running the Application

1. Clone the repository: `https://gitlab.com/elaniin.hipolito.dev/bookworm`
2. Install the dependencies: `npm install`
3. Set the environment variables.
4. Run the application: `npm start`

## Running the Application with Docker Compose

If you have Docker and Docker Compose installed, you can use Docker Compose to run the application and its dependencies.

1. Clone the repository: `https://gitlab.com/elaniin.hipolito.dev/bookworm`
2. Navigate to the project directory: `cd bookworm-api`
3. Create a `.env` file in the project directory and set the environment variables. Here's an example of what your `.env` file could look like:
4. Run the application with Docker Compose: `docker-compose up`. This will start your application and the PostgreSQL database in separate Docker containers. Your application will be accessible at http://localhost:3000.
5. When you're done, you can stop your application by running docker-compose down. This command will stop and remove the Docker containers

## Project Structure

- `src/`: This directory contains the source code of the application.
- `src/configs/`: This directory contains the configuration files.
- `src/controllers/`: This directory contains the business logic of the application.
- `src/middleware/`: This directory contains the middleware functions.
- `src/routes/`: This directory contains the route handlers for the API endpoints.
- `src/services/`: This directory contains the service modules. Each service module encapsulates a high-level functionality of the application, such as interacting with the database or external APIs.
- `utils`: This directory contains utility modules that provide helper functions used across the application.

## API Documentation

Please refer to the [API documentation](/api-docs/) for more information about the API endpoints.

## Recommended Usage

1. Create an user.
2. Login with your user.
3. Create a chat.
4. Open a websocket to the the app.
5. Authenticate on the socket sending a json like:
   ```
    {"type":"auth","token":"eyJhbGciOiJIUzI1NiIsInR5cCI6I..."}'
   ``` 
6. Send a message json like:
   ```
    {"chatId":"550cdd31-bbe6-4d5f-9293-75da740ef59b","content":"What kind of information is in this database?"}
   ``` 
