const path = require('path');

exports.show_home = function(req, res) {
    res.render('index', {
        flag = true;
    });
}