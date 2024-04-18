const nedb = require("nedb");
const path = require("path");

class supportDAO {
    constructor() {
        this.db = new nedb({filename: path.join(__dirname, '/tickets.db'), autoload: true});
    }
    init() {
    }
    getOpenTickets() {
        return new Promise((resolve, reject) => {
            this.db.find({closed:'false'}, function (err, entries) {
                if (err) {console.warn(err);reject();}
                resolve(entries);
            })
        }) 
    }
    addTicket(email, subject, body) {
        this.db.insert({
            email: email,
            subject: subject,
            body: body,
            closed: 'false'
        })
    }
    closeTicket(id) {
        this.db.update({_id:id}, {closed: 'true'},{});
    }
}
const dao = new supportDAO();
//dao.init();

module.exports = dao;