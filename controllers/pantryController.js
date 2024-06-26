const path = require('path');
const jwt = require('jsonwebtoken');
const emailvalidator = require('email-validator');
const userModel = require('../models/userModel');
const typesModel = require('../models/typesModel');
const donationModel = require('../models/donationModel');
const supportModel = require('../models/supportModel');

const passwordRegEx =  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&^])[A-Za-z\d@.#$!%*?&]{8,28}$/;

exports.show_home = function(req, res) {
    getUser(req.cookies.jwt, function(err, result) {
        let flag = true;
        if (result) {flag = false}
        res.render('index', {
            loggedIn: flag,
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
            loggedIn: flag,
        });
    })
}
exports.show_contact = function (req, res) {
    getUser(req.cookies.jwt, function(err, result) {
        let flag = true;
        if (result) {flag = false}
        res.render('contact', {
            loggedIn: flag,
        });
    })
}
exports.show_locations = function (req, res) {
    getUser(req.cookies.jwt, function(err, result) {
        let flag = true;
        if (result) {flag = false}
        res.render('pantries', {
            loggedIn: flag,
        });
    })
}
exports.show_donate = function (req, res) {
    userModel.getUsers('pantry')
    .then((pantries) => {
        typesModel.getTypes()
        .then((types) => {
            res.render('userDonate', {
                loggedIn: false,
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
                res.render('userHistory', {
                    rows: info,
                    flag: false,
                })
            })
        })
    })
}
exports.show_pantry_home = function (req, res) {
        res.render('pantryHome', {
            loggedIn: false,
            requestStat: 8
        })
}
exports.show_pantry_requests = function(req, res) {
    getUser(req.cookies.jwt, function (err, user) {
        const pantryId = user._id;
        let info = [];
        donationModel.getDonationsByPantryStatus(pantryId, 'pending')
        .then((donations) => {
            const promises = donations.map((donation) => {
                return new Promise((resolve, reject) => {
                    typesModel.getTypeById(donation.typeid, function(err, type) {
                        const typeName = type.name;
                        let harvest = new Date(donation.harvestDate);
                        harvest.setDate(harvest.getDate()+parseInt(type.daterange));
                        const useby = harvest.toISOString().split("T")[0];
                        userModel.findUserById(donation.pantryid, function(err, user) {
                            const pantryName = user.name;
                            let today = new Date();
                            if (harvest>today) {
                                info.push({
                                    type: typeName,
                                    useby: useby,
                                    pantryName: pantryName,
                                    _id: donation._id,
                                    quantity: donation.quantity,
                                })
                            }
                            resolve();
                        })
                    })
                    
                })
            })
    
                Promise.all(promises)
                .then(() => {
                    res.render('pantryRequests', {
                        rows: info,
                        flag: false,
                    })
                })
            })
        })
}
exports.show_pantry_deliveries = function(req, res) {
    getUser(req.cookies.jwt, function (err, user) {
        const pantryId = user._id;
        let info = [];
        donationModel.getDonationsByPantryStatus(pantryId, 'accepted')
        .then((donations) => {
            const promises = donations.map((donation) => {
                return new Promise((resolve, reject) => {
                    typesModel.getTypeById(donation.typeid, function(err, type) {
                        const typeName = type.name;
                        let harvest = new Date(donation.harvestDate);
                        harvest.setDate(harvest.getDate()+parseInt(type.daterange));
                        const useby = harvest.toISOString().split("T")[0];
                        userModel.findUserById(donation.pantryid, function(err, user) {
                            const pantryName = user.name;
                            let today = new Date();
                            if (harvest>today){
                                info.push({
                                    type: typeName,
                                    useby: useby,
                                    pantryName: pantryName,
                                    _id: donation._id,
                                    quantity: donation.quantity,
                                })
                            }
                            resolve();
                        })
                    })
                    
                })
            })
    
                Promise.all(promises)
                .then(() => {
                    res.render('pantryDeliveries', {
                        rows: info,
                        flag: false,
                    })
                })
            })
        })
}
exports.show_pantry_history = function(req, res) {
    getUser(req.cookies.jwt, function (err, user) {
        const pantryId = user._id;
        let info = [];
        donationModel.getDonationBypantry(pantryId)
        .then((donations) => {
            const promises = donations.map((donation) => {
                return new Promise((resolve, reject) => {
                    typesModel.getTypeById(donation.typeid, function(err, type) {
                        const typeName = type.name;
                        let harvest = new Date(donation.harvestDate);
                        harvest.setDate(harvest.getDate()+parseInt(type.daterange));
                        const useby = harvest.toISOString().split("T")[0];
                            info.push({
                                type: typeName,
                                useby: useby,
                                delivered: donation.delivered,
                                _id: donation._id,
                                quantity: donation.quantity,
                            }) 
                        resolve();
                    })
                    
                })
            })
    
                Promise.all(promises)
                .then(() => {
                    res.render('pantryHistory', {
                        rows: info,
                        flag: false,
                    })
                })
            })
        })
}
exports.show_pantry_market = function(req, res) {
    let info = [];
    donationModel.getAvailable()
    .then((donations) => {
        const promises = donations.map((donation) => {
            return new Promise((resolve, reject) => {
                typesModel.getTypeById(donation.typeid, function(err, type) {
                    const typeName = type.name;
                    let harvest = new Date(donation.harvestDate);
                    harvest.setDate(harvest.getDate()+parseInt(type.daterange));
                    const useby = harvest.toISOString().split("T")[0];
                    let today = new Date();
                    if (harvest>today){
                        info.push({
                            type: typeName,
                            useby: useby,
                            delivered: donation.delivered,
                            _id: donation._id,
                            quantity: donation.quantity,
                        })
                    }
                    resolve();
                })
                
            })
        })

            Promise.all(promises)
            .then(() => {
                res.render('pantryMarket', {
                    rows: info,
                    flag: false,
                })
            })
        })
}
exports.show_admin_pantries = function(req, res) {
    userModel.getUsers('pantry')
    .then((pantries) => {
        res.render('adminPantries', {
            rows: pantries,
            loggedIn: false,
        })
    })
}
exports.show_add_pantry = function(req, res) {
    res.render('adminNewPantry', {
        loggedIn: false,
    })
}
exports.show_admin_users = function(req, res) {
    userModel.getUsers('user')
    .then((pantries) => {
        res.render('adminUsers', {
            rows: pantries,
            loggedIn: false,
        })
    })
}
exports.show_admin_types = function(req, res) {
    typesModel.getTypes()
    .then((types) => {
        res.render('adminTypes', {
            rows: types,
            loggedIn: false,
        })
    })
}
exports.show_add_type = function(req, res) {
    res.render('adminAddType', {
        loggedIn: false
    })
}
exports.show_admin_support = function(req, res) {
    supportModel.getOpenTickets()
    .then((types) => {
        res.render('adminSupport', {
            rows: types,
            loggedIn: false,
        })
    })
}

exports.handle_register = function(req, res) {
    const firstname = req.body.firstname;
    const surname = req.body.surname;
    let DoB = new Date(req.body.dob);
    const email = req.body.email;
    const password = req.body.password;
    var message = '';

    if (!firstname || !surname || !req.body.dob || !email || !password) {
        message = message + "Missing Form Data; ";
    }
    var date = new Date();
    var date = date.setFullYear(date.getFullYear()-13)

    if (date<DoB) {
        message = message + " Not Old Enough; "
    }
    if (!emailvalidator.validate(email)) {
        message = message + "Invalid email; ";
    }
    if (!passwordRegEx.test(password)) {
        message = message + "Password Requirements not met; ";
    }
    userModel.findUserByEmail(email, function(err, user) {

        if (user) {
            message = message + "User with email already exists";
        }

        if (message) {
            return res.status(403).send(message);
        }
        userModel.addUser(firstname, surname, DoB.toISOString(), email, password);

        res.redirect('/login');
    })
    
    
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
        const typeid = req.body.typeid;
        const userid = user._id;
        const quantity = req.body.quantity;
        const harvestDate = new Date(req.body.harvestdate);
        const pantryid = req.body.pantryid;
        var message;

        if (!typeid || !userid || !quantity || !req.body.harvestdate || !pantryid ) {
            message = message + "Missing form data; ";
        }
        var date = new Date();
        if (date<harvestDate) {
            message = message + "Harvest cant be in future; ";
        }

        if (message) {
            return res.status(403).send(message);
        }

        var status;

        if (pantryid == 'any') {
            status = 'available';
        } else {
            status = 'pending';
        }
        donationModel.addDonation(typeid, userid, quantity, harvestDate.toISOString().split("T")[0], pantryid, status);
        res.redirect('/home');
    })
}
exports.handle_request_status = function(req, res) {
    getUser(req.cookies.jwt, function(err, user) {
        const userId = user._id;

        var split = req.body.choice.split(";");
        let status;

        if (!split || !userId) {
            return res.status(403).send("Missing Data");
        }

        if (split[0] == "accepted") {
            status = 'accepted';
        } else {
            status = 'available';
        }

        donationModel.changeStatus(split[1], status);
        res.redirect('/pantryrequests');
    })
}
exports.handle_delivery_status = function(req, res) {
    getUser(req.cookies.jwt, function(err, user) {
        const userId = user._id;
        const donationId = req.body.id;

        if (!userId || !donationId) {
            return res.status(403).send("Missing Data");
        } 
        donationModel.markDelivered(donationId);
        res.redirect('/pantrydeliveries');
    })
}
exports.handle_market_accept = function(req, res) {
    getUser(req.cookies.jwt, function(err, user) {
        const donationId = req.body.choice;
        donationModel.claim(user._id, donationId);
        res.redirect('/pantryMarket');
    })
    
}
exports.handle_add_pantry = function(req, res) {
    const name = req.body.name;
    const location = req.body.location;
    const email = req.body.email;
    const password = req.body.password;
    var message;

    if (!name || !location || !email || !password) {
        res.status(401).send("Missing Form Data!");
        return;
    }
    if (!emailvalidator.validate(email)) {
        message = message + "Invalid email; ";
    }
    if (!passwordRegEx.test(password)) {
        message = message + "Password Requirements not met; ";
    }

    if (message) {
        return res.status(403).send(message);
    }

    userModel.addPantry(name, email, location, password);
    res.redirect('/adminpantries');
}
exports.handle_delete_user = function(req, res) {
    const choice = req.body.choice;
    userModel.deleteUser(choice);
    res.status(200).send("User Deleted");
}
exports.handle_user_logout = function(req, res) {
    res.redirect('/login');
}
exports.handle_add_type = function(req, res) {
    const name = req.body.name;
    const daterange = req.body.daterange;
    var perishable = true;

    // Validation Here
    if (!name || !daterange) {
        return res.status(403).send("Missing Form Data");
    }

    if (daterange == 0) {
        perishable = false;
    }

    typesModel.addType(name, perishable, daterange);
    
    res.redirect('/admintypes');
}
exports.handle_delete_type = function(req, res) {
    const choice = req.body.choice;

    typesModel.removeType(choice);

    res.redirect('/admintypes');
}
exports.handle_close_ticket = function(req, res) {
    const choice = req.body.choice;
    if (!choice) {
        return res.status(403).send("No Id");
    }
    supportModel.closeTicket(choice);
    res.redirect('/adminsupport');
}
exports.handle_create_ticket = function(req, res) {
    const email = req.body.email;
    const subject = req.body.subject;
    const body = req.body.body;

    if (!email || !subject || !body) {
        return res.status(403).send("Missing Form Data");
    }
    supportModel.addTicket(email, subject, body);
    res.status(200).send("Ticket Sent");
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