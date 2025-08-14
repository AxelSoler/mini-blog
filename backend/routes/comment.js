const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment');
const { requireAuth } = require('../helpers');

router.post('/posts/:postId/comments', requireAuth, commentController.createComment);
router.delete('/posts/:postId/comments/:id', requireAuth, commentController.deleteComment);

module.exports = router;
