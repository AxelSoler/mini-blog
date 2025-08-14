const express = require('express');
const router = express.Router();
const reactionController = require('../controllers/reactions');
const { requireAuth } = require('../helpers');

router.post('/reactions/toggle', requireAuth, reactionController.toggleReaction);

module.exports = router;