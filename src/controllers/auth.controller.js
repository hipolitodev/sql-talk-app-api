const auth = require('../services/auth.service');
const users = require('../services/users.service');

const handleLogin = async (req, res) => {
    try {
        const user = await users.getUser(req.body.email);
        if (!user) return;

        const token = await auth.login(user, req.body.password);
        res.json(token);
    } catch (error) {
        console.log(error)
        res.status(500).send('An error occurred while creating the user.');
    }
};

module.exports = { handleLogin };
