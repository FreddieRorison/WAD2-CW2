const nedb = require("nedb");
const path = require("path");

class typeDAO {
    constructor() {
        this.db = new nedb({filename: path.join(__dirname, '/types.db'), autoload: true});
    }
    init() {
        this.db.insert({
            name: "Apples",
            perishable: "true",
            daterange: "6",
        })
        this.db.insert({
            name: "Oranges",
            perishable: "true",
            daterange: "3",
        })
        this.db.insert({
            name: "beans",
            perishable: "false",
            daterange: "",
        })
        this.db.insert({
            name: "Cereal",
            perishable: "true",
            daterange: "365",
        })
    }
    getTypes(cb) {
        this.db.find({}, function (err, entries) {
            if (err) {console.warn(err);return cb(null, null);}
            return cb(null, entries);
        })
    }
    addType(name, perishable, daterange) {
        var doc = {
            name: name,
            perishable: perishable,
            daterange: daterange,
        }
        this.db.insert(doc, function (err, doc) {
            if (err) {console.warn(err);}
        })
    }
    removeType(id) {
        this.db.remove({_id:id}, function(err, doc) {
            if (err) {console.warn(err);}
        })
    }
    changeType(id, name, perishable, daterange) {
        var doc = {
            name: name,
            perishable: perishable,
            daterange: daterange,
        }
        this.db.update({_id:id}, doc, function(err, doc) {
            if (err) {console.warn(err);}
        })
    }
    getTypeById(id, cb) {
        this.db.find({_id:id}, function (err, entries) {
            if (err) {console.warn(err); return cb(null, null);}
            return cb(null, entries[0]);
        })
    }
}
const dao = new typeDAO();
//dao.init();

module.exports = dao;