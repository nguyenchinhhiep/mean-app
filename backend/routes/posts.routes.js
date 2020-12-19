const express = require('express');
const PostModel = require('./../models/post.model');
const router = express.Router();
const multer = require('multer');
const checkAuth = require('./../middleware/check-auth');

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

router.post('',checkAuth,multer({storage: storage}).single('image'),(req, res, next) => {
    const url = req.protocol + '://' + req.get('host');
    const post = new PostModel({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + '/images/' + req.file.filename,
        createdBy: req.userData.userId
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
    const pageSize = +req.query.pageSize;
    const currentPage = +req.query.page;
    const postQuery = PostModel.find();
    let fetchPosts;
    if(pageSize && currentPage) {
        postQuery.skip(pageSize * (currentPage - 1))
        .limit(pageSize);

    }
    postQuery.then(document => {
        fetchPosts = document;
        return PostModel.countDocuments();
    }).then(totalRecords => {
        res.status(200).json({
            message: 'SUCCESS',
            posts: fetchPosts,
            totalRecords: totalRecords
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

router.put('/:id',checkAuth, multer({storage: storage}).single('image'),(req, res, next)=> {
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
        imagePath: imagePath,
        createdBy: req.userData.userId
    })
    PostModel.updateOne({_id: id, createdBy: req.userData.userId}, post).then((data)=> {
        if(data.nModified > 0) {
            res.status(201).json({
                message: 'SUCCESS'
            })
        } else {
            res.status(401).json({
                message: 'NOT AUTHORIZED'
            })
        }
        
    })
})
router.delete("/:id",checkAuth, (req,res, next) => {
    const id = req.params.id;
    PostModel.deleteOne({_id: id}).then(result => {
        if(result.n > 0) {
            res.status(201).json({
                message: 'SUCCESS'
            })
        } else {
            res.status(401).json({
                message: 'NOT AUTHORIZED'
            })
        }
        res.status(200).json({
            message: 'SUCCESS'
        })
    })
    
})

module.exports = router;