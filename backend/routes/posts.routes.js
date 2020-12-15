const express = require('express');
const PostModel = require('./../models/post.model');
const router = express.Router();
const multer = require('multer');
const { create } = require('./../models/post.model');
const { of } = require('rxjs');

const MIME_TYPE = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
}
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE[file.mimetype];
        let err = new Error('Invalid mime type');
        if(isValid) {
            err = null;
        }
        cb(err, 'backend/images');
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MIME_TYPE[file.mimetype];
        cb(null, `${name}-${Date.now()}.${ext}`)
    }
})

router.post('',multer({storage: storage}).single('image'),(req, res, next) => {
    const url = req.protocol + '://' + req.get('host');
    const post = new PostModel({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + '/images/' + req.file.filename
    });
    post.save().then(createdPost => {
        res.status(201).json({
            message: 'SUCCESS',
            post: {
                ...createdPost,
                id: createdPost._id 
            }
        });
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

router.put('/:id',multer({storage: storage}).single('image'),(req, res, next)=> {
    let imagePath;
    if(req.file) {
        const url = req.protocol + '://' + req.get('host');
        imagePath = url + '/images/' + req.file.filename;
    } else {
        imagePath = req.body.imagePath;
    }
    const id = req.params.id;
    const post = new PostModel({
        _id: id,
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath
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