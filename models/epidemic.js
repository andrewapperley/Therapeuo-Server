
var mongoose = require('mongoose');
var categorySchema = require('./category-schema');

module.exports = function() {

    return mongoose.model('Category', categorySchema);

}();
