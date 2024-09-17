const express = require('express');
const { protect } = require('../middlewares/auth.middleware');
const {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
} = require('../controllers/chat.controller');

const router = express.Router();

router.route('/').post(protect, accessChat);
router.route('/').get(protect, fetchChats);
router.route('/group').post(protect, createGroupChat);
router.route('/rename').put(protect, renameGroup);
router.route('/group-add').put(protect, addToGroup);
router.route('/group-remove').put(protect, removeFromGroup);

module.exports = router;
