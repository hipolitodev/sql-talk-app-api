require('dotenv').config();
const path = require('path');
const http = require('http');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const {
  authenticateToken,
} = require('./src/middlewares/authenticateToken.middleware');
const {
  validatePremiumUser,
} = require('./src/middlewares/validatePremiumUser.middleware');
const { logger } = require('./src/middlewares/logger.middleware');
const loggerUtil = require('./src/utils/logger.util');
const { createSocketServer } = require('./src/services/websocket.service');

const app = express();
const PORT = process.env.PORT || 3000;

const authRouter = require('./src/routes/auth.route');
const usersRouter = require('./src/routes/users.route');
const chatsRouter = require('./src/routes/chats.route');
const messagesRouter = require('./src/routes/messages.route');
const swaggerDocument = YAML.load('./docs/swagger.docs.yaml');

app.use(cors());
app.use(logger);
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Public routes
app.use('/api', authRouter);
app.use('/api', usersRouter);

// Middlewares
app.use('/api', authenticateToken);
app.use('/api', validatePremiumUser);

// Protected routes
app.use('/api', chatsRouter);
app.use('/api', messagesRouter);

app.use(express.static(path.join(__dirname, '../public')));

const server = http.createServer(app);
createSocketServer(server);

server.listen(PORT, () => {
  loggerUtil.info(`Server is running on http://localhost:${PORT}...`);
});
