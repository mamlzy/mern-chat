const express = require('express');
const { registerUser, allUsers } = require('../controllers/user.controller');
const { authUser } = require('../controllers/user.controller');
const { protect } = require('../middlewares/auth.middleware');

const router = express.Router();

router.route('/').post(registerUser).get(protect, allUsers);
router.post('/login', authUser);

module.exports = router;
