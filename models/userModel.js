const nedb = require("nedb");
const path = require("path");
const bcrypt = require("bcrypt");
const saltrounds = 10;

class UserDao {
    constructor() {
        this.db = new nedb({filename: path.join(__dirname, '/users.db'), autoload: true});
    }
    getUsers() {
        return new Promise((resolve, reject) => {
            this.db.find({}, function(err, entries) {
                if (err) {console.warn(err);reject("Error");}
                resolve(entries);
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
                password: hash
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

module.exports = dao;