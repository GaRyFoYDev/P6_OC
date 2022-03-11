
const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const emailValidator = require('../middleware/emailValidator');
const password = require("../middleware/password");


// Routes utilisateurs
router.post('/signup', emailValidator, password, userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;