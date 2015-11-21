
var mongoose = require('mongoose');
var messageSchema = require('./message-schema');

module.exports = function() {

    return mongoose.model('Message', messageSchema);
}();
