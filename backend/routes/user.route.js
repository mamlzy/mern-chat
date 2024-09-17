const express = require('express');
const { registerUser } = require('../controllers/user.controller');
const { authUser } = require('../controllers/user.controller');

const router = express.Router();

router.route('/').post(registerUser);
router.route('/login').post(authUser);

module.exports = router;
