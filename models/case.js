
var mongoose = require('mongoose');
var caseSchema = require('./case-schema');

module.exports = function() {

    return mongoose.model('Case', caseSchema);

}();
