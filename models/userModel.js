const nedb = require("nedb");
const path = require("path");
const bcrypt = require("bcrypt");
const saltrounds = 10;

class UserDao {
    constructor() {
        this.db = new nedb({filename: path.join(__dirname, '/users.db'), autoload: true});
    }
    init() {
        this.db.insert({
            name: "Glasgow Pantry 1",
            email: "email@email.com",
            location: "glasgow",
            password: "who cares",
            accounttype: 'pantry',
        })
        this.db.insert({
            name: "Glasgow Pantry 2",
            email: "email@email.com",
            location: "glasgow",
            password: "who cares",
            accounttype: 'pantry',
        })
        this.db.insert({
            name: "Glasgow Pantry 3",
            email: "email@email.com",
            location: "glasgow",
            password: "who cares",
            accounttype: 'pantry',
        })
    }
    getUsers(type) {
        return new Promise((resolve, reject) => {
            this.db.find({accounttype:type}, function(err, entries) {
                if (err) {console.warn(err);reject(err);}
                return resolve(entries);
            })
        })  
    }
    addUser(firstname, surname, dob, email, password) {
        var that = this;
        bcrypt.hash(password, saltrounds).then(function(hash) {
            var user = {
                firstname: firstname,
                surname: surname,
                email: email,
                dob: dob,
                password: hash,
                accounttype: 'user',
            }
            that.db.insert(user, function(err, doc) {
                if (err) {console.warn(err);}
            })
        })
    }
    deleteUser(id) {
        this.db.remove({_id:id});
    }
    addPantry(name, email, location, password) {
        var that = this;
        bcrypt.hash(password, saltrounds).then(function(hash) {
            var user = {
                name: name,
                email: email,
                location: location,
                password: hash,
                accounttype: 'pantry',
            }
            that.db.insert(user, function(err, doc) {
                if (err) {console.warn(err);}
            })
        })
    }
    findUserById(id, cb) {
        this.db.find({'_id':id}, function (err, entries) {
            if (err) {console.warn(err); return cb(null, null)
            } else if (entries.length == 0) {
                return cb(null, null);
            } else {
                return cb(null, entries[0]);
            }
        });
    }
    findUserByEmail(email, cb) {
        this.db.find({'email':email}, function (err, entries) {
            if (err) {console.warn(err); return cb(null, null)} 
            else if (entries.length == 0) {
                return cb(null, null);
            } else {
                return cb(null, entries[0]);
            }
        });
    }
}
const dao = new UserDao();
//dao.init();

module.exports = dao;