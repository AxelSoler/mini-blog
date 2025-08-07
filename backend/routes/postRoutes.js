const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

router.get('/', postController.getAllPosts);
router.post('/create', postController.createPost);
router.put('/edit/:id', postController.editPost);
router.delete('/delete/:id', postController.deletePost);

module.exports = router;
