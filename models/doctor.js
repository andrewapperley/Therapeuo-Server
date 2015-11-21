
var mongoose = require('mongoose');
var doctorSchema = require('./doctor-schema');

module.exports = function() {

    return mongoose.model('Doctor', doctorSchema);

}();
