const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const login = async (user, password) => {
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return;

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return token;
}

module.exports = {
    login,
};
