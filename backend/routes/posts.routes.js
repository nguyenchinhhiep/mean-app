const express = require('express');
const router = express.Router();
const postsControllers = require('./../controllers/posts.controllers');
const checkAuth = require('./../middleware/check-auth');
const extractFile = require('./../middleware/file');


router.post('',checkAuth,extractFile,postsControllers.createPost)
router.get('', postsControllers.getPosts);

router.get('/:id', postsControllers.getPostById)

router.put('/:id',checkAuth,extractFile ,postsControllers.updatePost)
router.delete("/:id",checkAuth, postsControllers.deletePost)

module.exports = router;