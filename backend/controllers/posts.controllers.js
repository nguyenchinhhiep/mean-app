const PostModel = require('./../models/post.model');

exports.getPosts = (req, res, next) => {
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
    }).catch(err => {
        res.status(500).json({
            message: 'Fetching posts failed'
        })
    });;
}

exports.createPost = (req, res, next) => {
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
    }).catch(err => {
        res.status(500).json({
            message: 'Creating a post failed'
        })
    });
   
}

exports.getPostById = (req, res, next) => {
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
    }).catch(err => {
        res.status(500).json({
            message: 'Fetching the post failed'
        })
    });
}

exports.updatePost = (req, res, next)=> {
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
        if(data.n > 0) {
            res.status(201).json({
                message: 'SUCCESS'
            })
        } else {
            res.status(401).json({
                message: 'NOT AUTHORIZED'
            })
        }
        
    }).catch(err => {
        res.status(500).json({
            message: "Couldn't update post"
        })
    });
}

exports.deletePost = (req,res, next) => {
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
    }).catch(err => {
        res.status(500).json({
            message: 'Deleting the post failed'
        })
    });
    
}