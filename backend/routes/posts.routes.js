const express = require('express');
const PostModel = require('./../models/post.model');
const router = express.Router();

router.post('', (req, res, next) => {
    const post = new PostModel({ title: req.body.title, content: req.body.content });
    post.save();
    res.status(201).json({
        message: 'SUCCESS'
    });
})
router.get('', (req, res, next) => {
    PostModel.find().then(document => {
        res.status(200).json({
            message: 'SUCCESS',
            posts: document
        });
    });
});

router.get('/:id', (req, res, next) => {
    const id = req.params.id;
    PostModel.findById(id).then(post => {
        if (post) {
            res.status(200).json({
                message: 'SUCCESS',
                post: post
            })
        } else {
            res.status(404).json({
                message: 'NOT FOUND'
            })
        }
    })
})

router.put('/:id', (req, res, next)=> {
    const id = req.params.id;
    const post = new PostModel({
        _id: id,
        title: req.body.title,
        content: req.body.content
    })
    PostModel.updateOne({_id: id}, post).then((data)=> {
        res.status(201).json({
            message: 'SUCCESS'
        })
    })
})
router.delete("/:id", (req,res, next) => {
    const id = req.params.id;
    PostModel.deleteOne({_id: id}).then(result => {
        console.log(result);
        res.status(200).json({
            message: 'SUCCESS'
        })
    })
    
})

module.exports = router;