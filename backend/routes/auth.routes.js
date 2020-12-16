
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const UserModel = require('./../models/user.model');
router.post('/signup', (req, res, next) => {
    bcrypt.hash(req.body.password, 10, (hash) => {
        const user = new UserModel({
            email: req.body.email,
            password: hash
        })
        user.save().then(result => {
            res.status(201).json({
                message: 'SUCCESS',
                result: result
            })
        }).catch(error => {
            res.status(500).json({
                error: error
            })
        })
    })
    
});

module.exports = router;