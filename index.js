require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { authenticateToken } = require('./src/middlewares/authenticateToken.middleware');

const app = express();
const PORT = process.env.PORT || 3000;
const path = require('path');

const filesRouter = require('./src/routes/files.route');
const usersRouter = require('./src/routes/users.route');
const authRouter = require('./src/routes/auth.route');

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

app.use('/api', authRouter);

// Protected routes
app.use('/api', authenticateToken);
app.use('/api', filesRouter);
app.use('/api', usersRouter);

app.use(express.static(path.join(__dirname, '../public')));

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
