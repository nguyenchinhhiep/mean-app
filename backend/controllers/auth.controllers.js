const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('./../models/user.model');

exports.signupUser = (req, res, next) => {
    bcrypt.hash(req.body.password, 10, (error, encrypted) => {
        const user = new UserModel({
            email: req.body.email,
            password: encrypted
        });
        user.save().then(result => {
            res.status(201).json({
                message: 'SUCCESS',
                result: result
            })
        }).catch(error => {
            res.status(500).json({
                message: 'Sign up failed'
            })
        })
    })

}

exports.loginUser = (req, res, next) => {
    let theUser;
    UserModel.findOne({ email: req.body.email }).then(user => {
        if (!user) {
            return res.status(401).json({
                message: 'Invaid email or password'
            })
        }
        theUser = user;
        bcrypt.compare(req.body.password, user.password).then(same => {
            if (!same) {
                return res.status(401).json({
                    message: 'Invaid email or password'
                })
            };
            const token = jwt.sign({ email: theUser.email, userId: theUser._id }, 'this_is_secret_key', {
                expiresIn: '1h'
            });
    
            res.status(200).json({
                token: token,
                expiresIn: 3600,
                userId: theUser._id
            })
        });
    })
    .catch(error => {
        return res.status(401).json({
            message: error
        })
    })
}