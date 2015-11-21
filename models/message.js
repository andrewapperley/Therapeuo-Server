
var mongoose = require('mongoose');
var clientSchema = require('./client-schema');

module.exports = function() {

    return mongoose.model('Client', clientSchema);
}();
