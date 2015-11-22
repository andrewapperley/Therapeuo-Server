//"b5viPJBfnZZhO1qXGmPoz1yDkhUbGNEA"
var db = require('./database');
var MessageService = require('../services/message-service');
module.exports = function(config) {

    return db.config(config.get("mongo"))
        .then(function() {
            return db.models();
        })
        .then(function() {
            return MessageService.config(config.get("twilio"));
        })
        .catch(function(error) {
            console.log("Error:", error);
        });

};
