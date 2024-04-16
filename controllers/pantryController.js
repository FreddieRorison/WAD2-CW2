const path = require('path');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const { get } = require('http');

exports.show_home = function(req, res) {
    getUser(req.cookies.jwt, function(err, result) {
        let flag = true;
        if (result) {flag = false}
        res.render('index', {
            flag: flag,
        });
    })
}
exports.show_login = function(req, res) {
    getUser(req.cookies.jwt, function(err, result) {
        if (result) {
            res.redirect('/home');
        } else {
            res.render('login');
        }
    })
}
exports.show_register = function(req, res) {
    getUser(req.cookies.jwt, function(err, result) {
        if (result) {
            res.redirect('/home');
        } else {
            res.render('register');
        }
    })
}
exports.show_about = function(req, res) {
    getUser(req.cookies.jwt, function(err, result) {
        let flag = true;
        if (result) {flag = false}
        res.render('about', {
            flag: flag,
        });
    })
}
exports.show_contact = function (req, res) {
    getUser(req.cookies.jwt, function(err, result) {
        let flag = true;
        if (result) {flag = false}
        res.render('contact', {
            flag: flag,
        });
    })
}
exports.show_donate = function (req, res) {
    
}
exports.show_locations = function (req, res) {
    getUser(req.cookies.jwt, function(err, result) {
        let flag = true;
        if (result) {flag = false}
        res.render('pantries', {
            flag: flag,
        });
    })
}

exports.handle_register = function(req, res) {
    const firstname = req.body.firstname;
    const surname = req.body.surname;
    let DoB = new Date(req.body.dob);
    const email = req.body.email;
    const password = req.body.password;

    // Validation Goes Here

    if (!firstname || !surname || !req.body.dob || !email || !password) {
        res.status(401).send("Missing Form Data!");
        return;
    }

    userModel.addUser(firstname, surname, DoB.toISOString(), email, password);

    res.redirect('/login');
}

exports.handle_login = function(req, res) {
    res.redirect('/home');
}

exports.user_home = function(req, res) {
    getUser(req.cookies.jwt, function(err, user) {
        if (!user) {
            return res.status(500).send("Error");
        }
        res.render('userHome', {
            firstname: user.firstname,
        });
    })
}

function getUser(token, cb) {
    try {
        let payload = jwt.verify(token, process.env.SECRET_ACCESS_TOKEN);
        userModel.findUserById(payload._id, function(err, user) {
            return cb(null, user);
        }) 
    } catch (e) {
        return cb(null, null);
    }
}