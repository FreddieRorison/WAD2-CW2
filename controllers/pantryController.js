const path = require('path');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const typesModel = require('../models/typesModel');
const donationModel = require('../models/donationModel');

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
exports.show_locations = function (req, res) {
    getUser(req.cookies.jwt, function(err, result) {
        let flag = true;
        if (result) {flag = false}
        res.render('pantries', {
            flag: flag,
        });
    })
}
exports.show_donate = function (req, res) {
    userModel.getUsers('pantry')
    .then((pantries) => {
        typesModel.getTypes(function(err, types) {
            res.render('userDonate', {
                flag: false,
                types: types,
                pantries: pantries,
            })
        })
    })
    .catch((err) => {
        console.log("REJECTED ", err)
    });
}
exports.show_user_history = function (req, res) {
    getUser(req.cookies.jwt, function (err, user) {
    const userId = user._id;
    let info = [];
    
    donationModel.getDonationsByUser(userId)
    .then((donations) => {
        const promises = donations.map((donation) => {
            return new Promise((resolve, reject) => {
                typesModel.getTypeById(donation.typeid, function(err, type) {
                    const typeName = type.name;
                    let harvest = new Date(donation.harvestDate);
                    harvest.setDate(harvest.getDate()+type.daterange);
                    const useby = harvest.toISOString().split("T")[0];
                    userModel.findUserById(donation.pantryid, function(err, user) {
                        const pantryName = user.name;
                        info.push({
                            type: typeName,
                            useby: useby,
                            pantryName: pantryName,
                            _id: donation._id,
                            quantity: donation.quantity,
                            status: donation.status,
                        })
                        resolve();
                    })
                })
                
            })
        })

        Promise.all(promises)
        .then(() => {
            console.log(info);
            res.render('userHistory', {
                rows: info,
                flag: false,
            })
        })

        
        
    })
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
        if (user.accounttype == 'pantry') {
            return res.redirect('pantryhome');
        }
        res.render('userHome', {
            firstname: user.firstname,
        });
    })
}
exports.handle_donate = function(req, res) {
    getUser(req.cookies.jwt, function(err, user) {
        if (!user) {
            return res.status(500).send("Error");
        }
        if (user.accounttype == 'pantry') {
            return res.redirect('pantryhome');
        }
        const typeid = req.body.typeid;
        const userid = user._id;
        const quantity = req.body.quantity;
        const harvestDate = new Date(req.body.harvestdate);
        const pantryid = req.body.pantryid;

        if (!typeid || !userid || !quantity || !req.body.harvestdate || !pantryid ) {
            return res.status(401).send("Form Data Missing");
        }

        // Validation Here

        var status;

        if (pantryid == 'any') {
            status = 'available';
        } else {
            status = 'pending';
        }
        console.log(status);
        donationModel.addDonation(typeid, userid, quantity, harvestDate.toISOString().split("T")[0], pantryid, status);
        res.redirect('/home');
    })
}

function getUser(token, cb) {
    try {
        let payload = jwt.verify(token, process.env.SECRET_ACCESS_TOKEN);
        userModel.findUserById(payload._id, function(err, user) {
            if (err) {console.warn(err); return cb(null, null);}
            return cb(null, user);
        }) 
    } catch (e) {
        return cb(null, null);
    }
}