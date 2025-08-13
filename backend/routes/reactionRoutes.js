const express = require('express');
const router = express.Router();
const reactionController = require('../controllers/reactionsController');
const { requireAuth } = require('../helpers');

router.post('/reactions/toggle', requireAuth, reactionController.toggleReaction);

module.exports = router;