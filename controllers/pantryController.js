const path = require('path');
const userModel = require('../models/userModel');

exports.show_home = function(req, res) {
    res.render('index', {
        flag: true,
    });
}
exports.show_login = function(req, res) {
    res.render('login');
}
exports.show_register = function(req, res) {
    res.render('register');
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

    res.status(200).send("Success");
}

exports.handle_login = function(req, res) {
    res.status(200).send("Logged In");
}

exports.user_home = function(req, res) {
    res.status(200).send("Awesome!");
}