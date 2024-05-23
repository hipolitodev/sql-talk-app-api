const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;
const path = require('path');

const filesRouter = require('./src/routes/files.route');
const usersRouter = require('./src/routes/users.route');

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

app.get('/', (req, res) => {
    res.json({ 'message': 'ok' });
})

app.use('/api', filesRouter);
app.use('/api', usersRouter);

app.use(express.static(path.join(__dirname, '../public')));

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
