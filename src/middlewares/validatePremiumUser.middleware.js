const validatePremiumUser = (req, res, next) => {
  if (!req.user.isPremium)
    return res.status(403).json({
      status: 403,
      error: {
        code: 'FORBIDDEN_ACCESS',
        message: 'You do not have permission to access this resource.',
      },
    });
  next();
};

module.exports = { validatePremiumUser };
