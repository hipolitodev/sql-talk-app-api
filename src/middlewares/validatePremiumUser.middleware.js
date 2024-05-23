const validatePremiumUser = (req, res, next) => {
    if (!req.user.isPremium) return res.sendStatus(403);
    next();
};

module.exports = { validatePremiumUser };
