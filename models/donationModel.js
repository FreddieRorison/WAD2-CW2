const nedb = require("nedb");
const path = require("path");

class donationDAO {
    constructor() {
        this.db = new nedb({filename: path.join(__dirname, '/donation.db'), autoload: true});
    }
    init() {
    }
    addDonation(typeId, userId, quantity, harvestDate, pantryId, status) {
        var doc = {
            typeid: typeId,
            userid: userId,
            quantity: quantity,
            harvestDate: harvestDate,
            pantryid: pantryId,
            delivered: 'false',
            status: 'pending',
        }
        this.db.insert(doc, function (err, doc) {
            if (err) {console.warn(err);}
        })
    }
    getAvailable() {
        return new Promise((resolve, reject) => {
        let date = new Date();
        this.db.find({status:'available'}, function(err, donations) {
            if (err) {console.warn(err);reject();}
            resolve(donations);
        })
        })
        
    }
    getDonationBypantry(id) {
        return new Promise((resolve, reject) => {
            this.db.find({pantryid: id}, function(err, donations) {
                if (err) {console.warn(err);reject(err)}
                resolve(donations);
            })
        })
    }
    getDonationsByPantryStatus(id, status) {
        return new Promise((resolve, reject) => {
            this.db.find({pantryid: id, status: status, delivered: 'false'}, function(err, donations) {
                if (err) {console.warn(err);reject(err)}
                resolve(donations);
            })
        })
    }
    getDonationsByUser(id) {
        return new Promise((resolve, reject) => {
            this.db.find({userid: id}, function(err, donations) {
                if (err) {console.warn(err);reject()}
                resolve(donations);
            })
        })
        
    }
    changeStatus(id, status) {
        this.db.update({_id:id}, {$set: {status: status}},{});
    }
    markDelivered(id, status) {
        this.db.update({_id:id}, {$set: {delivered: 'true'}},{});
    }
    
}
const dao = new donationDAO();
//dao.init();

module.exports = dao;