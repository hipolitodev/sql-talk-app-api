const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const login = async (user, password) => {
    const isPremium = process.env.PREMIUM_USERS.includes(user.email);
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return;

    const tokenData = {
        userId: user.id,
        isPremium
    }

    const token = jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: '1h' });
    return token;
}

module.exports = {
    login,
};
