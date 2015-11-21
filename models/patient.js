
var mongoose = require('mongoose');
var patientSchema = require('./patient-schema');

module.exports = function() {

   return mongoose.model('Patient', patientSchema);

}();
