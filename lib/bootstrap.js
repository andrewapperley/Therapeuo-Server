
var db = require('./database');

module.exports = function(config) {

    return db.config(config.get("mongo"))
        .then(function() {
            return db.models();
        })
        .catch(function(error) {
            console.log("Error:", error);
        });

};
