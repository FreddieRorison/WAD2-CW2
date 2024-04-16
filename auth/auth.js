const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

exports.login = function(req, res, next) {
    const email = req.body.email;
    const password = req.body.password;

    userModel.findUserByEmail(email, function(err, result) {
        if (err) {
            res.status(401).send("Error");
            return;
        }
        if (!result) {
            res.status(401).send("User Not Found");
            return;
        }

        bcrypt.compare(password, result.password, function (err, response) {
            if (response) {
                let payload = { _id : result._id};
                let accessToken = jwt.sign(payload, process.env.SECRET_ACCESS_TOKEN, {expiresIn: 600});
                res.cookie("jwt", accessToken);
                next();
            } else {
                res.status(403).send("Username Or Password Incorrect");
                return;
            }
        })
        return;
    })
}

exports.verify = function(req, res, next) {
    let accessToken = req.cookies.jwt;
    if (!accessToken) {
        return res.status(403).send();
    }
    let payload;
    try {
        payload = jwt.verify(accessToken, process.env.SECRET_ACCESS_TOKEN);
        next();
    } catch (e) {
        res.status(401).send();
    }
}