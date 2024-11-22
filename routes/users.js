const express = require("express");
const router = express.Router();
const usersCtrl = require("../controllers/users");
const rateLimiter = require("../middlewares/rateLimiter");
const { body, validationResult } = require("express-validator");

const loginValidator = [
    body("email").escape(),
    body("email").trim(),
    body("email").notEmpty(),
    body("email").isEmail(),
];

router.post("/signup", loginValidator, usersCtrl.signup);

router.post("/login", rateLimiter, usersCtrl.login);

module.exports = router;
