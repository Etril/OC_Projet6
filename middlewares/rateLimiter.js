const rateLimit = require("express-rate-limit");

module.exports = rateLimit({
    windowMs: 24 * 60 * 60 * 1000, 
    max: 100,
    message: 'Vous avez excédé le nombre de tentatives autorisées en 24H', 
    standardHeaders: true,
    legacyHeaders: false,
});