const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { requireAuth } = require('../helpers');

router.get('/', postController.getAllPosts);
router.get('/posts/:id', postController.getPostById);
router.post('/create', requireAuth, postController.createPost);
router.put('/edit/:id', requireAuth, postController.editPost);
router.delete('/delete/:id', requireAuth, postController.deletePost);

module.exports = router;
